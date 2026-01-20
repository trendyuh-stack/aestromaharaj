// Database types for the astrology platform

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Astrologer {
  id: string;
  user_id: string | null;
  name: string;
  expertise: string[];
  experience_years: number;
  bio: string | null;
  price_per_session: number;
  rating: number | null;
  total_consultations: number | null;
  languages: string[];
  avatar_url: string | null;
  is_active: boolean;
  available_slots: any[];
  created_at: string;
  updated_at: string;
}

export interface Kundali {
  id: string;
  user_id: string;
  name: string;
  gender: string;
  date_of_birth: string;
  time_of_birth: string;
  place_of_birth: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
  chart_data: any | null;
  planetary_positions: any | null;
  houses: any | null;
  nakshatra: string | null;
  rashi: string | null;
  lagna: string | null;
  predictions: any | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  astrologer_id: string;
  kundali_id: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  payment_amount: number;
  payment_id: string | null;
  meet_link: string | null;
  notes: string | null;
  user_notes: string | null;
  astrologer_notes: string | null;
  created_at: string;
  updated_at: string;
  astrologer?: Astrologer;
  kundali?: Kundali;
}

export type BookingWithDetails = Booking & {
  astrologer: Astrologer;
  kundali?: Kundali | null;
};
