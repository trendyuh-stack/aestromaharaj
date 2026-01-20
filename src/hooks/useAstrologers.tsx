import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Astrologer } from '@/types/database';
import { toast } from 'sonner';

export const useAstrologers = () => {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAstrologers = async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('astrologers')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (fetchError || !data || data.length === 0) {
      // Fallback to mock data for demo/development
      console.log('Using mock astrologer data');
      setAstrologers([
        {
          id: '1',
          name: 'Acharya Rajeshwar',
          expertise: ['Vedic Kundali', 'Prashna Shastra'],
          experience_years: 15,
          rating: 4.9,
          price_per_session: 1100,
          languages: ['Hindi', 'English', 'Sanskrit'],
          is_active: true,
          bio: 'Specialist in Vedic Kundali analysis and career guidance.',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Dr. Priya Sharma (PhD)',
          expertise: ['Tarot Reading', 'Relationship Counseling'],
          experience_years: 12,
          rating: 4.8,
          price_per_session: 1500,
          languages: ['English', 'Hindi', 'Marathi'],
          is_active: true,
          bio: 'Certified Tarot Master with a PhD in Psychology.',
          avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Shastri Vikram Nath',
          expertise: ['Numerology', 'Vastu Shastra'],
          experience_years: 20,
          rating: 4.9,
          price_per_session: 2100,
          languages: ['Hindi', 'Gujarati'],
          is_active: true,
          bio: 'Renowned expert in Vastu and Numerology for home and business.',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Pt. Ananya Devi',
          expertise: ['Face Reading', 'Palmistry'],
          experience_years: 10,
          rating: 4.7,
          price_per_session: 900,
          languages: ['English', 'Bengali', 'Hindi'],
          is_active: true,
          bio: 'Gifted intuitive reader specializing in face reading and palmistry.',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
          created_at: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Swami Anand',
          expertise: ['Meditation', 'Spiritual Healing'],
          experience_years: 25,
          rating: 5.0,
          price_per_session: 2500,
          languages: ['English', 'Hindi'],
          is_active: true,
          bio: 'Spiritual guide helping you find inner peace and clarity.',
          avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
          created_at: new Date().toISOString()
        },
        {
          id: '6',
          name: 'Acharya Meera',
          expertise: ['Career Astrology', 'Gemology'],
          experience_years: 18,
          rating: 4.8,
          price_per_session: 1800,
          languages: ['Hindi', 'English'],
          is_active: true,
          bio: 'Expert recommendation on gemstones and career paths.',
          avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
          created_at: new Date().toISOString()
        }
      ] as Astrologer[]);
    } else {
      setAstrologers(data as Astrologer[]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchAstrologers();
  }, []);

  const getAstrologerById = async (id: string) => {
    const { data, error } = await supabase
      .from('astrologers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      toast.error('Failed to load astrologer details');
      return null;
    }

    return data as Astrologer | null;
  };

  return {
    astrologers,
    isLoading,
    error,
    getAstrologerById,
    refetch: fetchAstrologers,
  };
};
