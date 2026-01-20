-- Create profiles table for user information
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create astrologers table
CREATE TABLE public.astrologers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    expertise TEXT[] NOT NULL DEFAULT '{}',
    experience_years INTEGER NOT NULL DEFAULT 0,
    bio TEXT,
    price_per_session INTEGER NOT NULL DEFAULT 500,
    rating DECIMAL(2,1) DEFAULT 4.5,
    total_consultations INTEGER DEFAULT 0,
    languages TEXT[] DEFAULT '{Hindi, English}',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    available_slots JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kundalis table for birth charts
CREATE TABLE public.kundalis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    gender TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    time_of_birth TIME NOT NULL,
    place_of_birth TEXT NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    timezone TEXT NOT NULL,
    chart_data JSONB,
    planetary_positions JSONB,
    houses JSONB,
    nakshatra TEXT,
    rashi TEXT,
    lagna TEXT,
    predictions JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    astrologer_id UUID NOT NULL REFERENCES public.astrologers(id) ON DELETE CASCADE,
    kundali_id UUID REFERENCES public.kundalis(id) ON DELETE SET NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    payment_amount INTEGER NOT NULL,
    payment_id TEXT,
    meet_link TEXT,
    notes TEXT,
    user_notes TEXT,
    astrologer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astrologers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kundalis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if user is an astrologer
CREATE OR REPLACE FUNCTION public.is_astrologer(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.astrologers
        WHERE user_id = _user_id AND is_active = true
    )
$$;

-- Create helper function to check if user is booking astrologer
CREATE OR REPLACE FUNCTION public.is_booking_astrologer(_booking_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.bookings b
        JOIN public.astrologers a ON b.astrologer_id = a.id
        WHERE b.id = _booking_id AND a.user_id = auth.uid()
    )
$$;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Astrologers RLS Policies (public read, owner edit)
CREATE POLICY "Anyone can view active astrologers"
    ON public.astrologers FOR SELECT
    USING (is_active = true OR user_id = auth.uid());

CREATE POLICY "Astrologers can update their own profile"
    ON public.astrologers FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can become astrologers"
    ON public.astrologers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Kundalis RLS Policies (full user isolation)
CREATE POLICY "Users can view their own kundalis"
    ON public.kundalis FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own kundalis"
    ON public.kundalis FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own kundalis"
    ON public.kundalis FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own kundalis"
    ON public.kundalis FOR DELETE
    USING (auth.uid() = user_id);

-- Bookings RLS Policies
CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id OR public.is_booking_astrologer(id));

CREATE POLICY "Users can create bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and astrologers can update bookings"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = user_id OR public.is_booking_astrologer(id));

CREATE POLICY "Users can cancel their own bookings"
    ON public.bookings FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_astrologers_updated_at
    BEFORE UPDATE ON public.astrologers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kundalis_updated_at
    BEFORE UPDATE ON public.kundalis
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto-creating profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_kundalis_user_id ON public.kundalis(user_id);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_astrologer_id ON public.bookings(astrologer_id);
CREATE INDEX idx_bookings_scheduled_at ON public.bookings(scheduled_at);
CREATE INDEX idx_astrologers_is_active ON public.astrologers(is_active);

-- Insert sample astrologers for testing
INSERT INTO public.astrologers (name, expertise, experience_years, bio, price_per_session, rating, languages, avatar_url) VALUES
('Pandit Ramesh Sharma', ARRAY['Vedic Astrology', 'Kundali Matching', 'Career Guidance'], 25, 'With 25 years of experience in Vedic astrology, I specialize in birth chart analysis and life predictions.', 999, 4.9, ARRAY['Hindi', 'English', 'Sanskrit'], 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200'),
('Dr. Priya Joshi', ARRAY['Numerology', 'Vastu', 'Relationship Counseling'], 15, 'Expert in combining numerology with astrology for comprehensive life guidance.', 799, 4.8, ARRAY['Hindi', 'English', 'Marathi'], 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'),
('Acharya Vikram Singh', ARRAY['Palmistry', 'Gemstone Consultation', 'Health Astrology'], 30, 'Traditional palmist and gemstone expert with deep knowledge of remedial astrology.', 1299, 4.9, ARRAY['Hindi', 'English', 'Punjabi'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'),
('Jyotishi Maya Devi', ARRAY['Tarot Reading', 'Past Life Regression', 'Spiritual Healing'], 12, 'Intuitive tarot reader combining ancient wisdom with modern spiritual practices.', 699, 4.7, ARRAY['Hindi', 'English'], 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200');