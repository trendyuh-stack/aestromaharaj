import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Kundali } from '@/types/database';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface KundaliInput {
  name: string;
  gender: string;
  date_of_birth: string;
  time_of_birth: string;
  place_of_birth: string;
  timezone: string;
  latitude?: number;
  longitude?: number;
}

export const useKundalis = () => {
  const { user } = useAuth();
  const [kundalis, setKundalis] = useState<Kundali[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKundalis = async () => {
    if (!user) {
      setKundalis([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('kundalis')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      toast.error('Failed to load kundalis');
    } else {
      setKundalis(data as Kundali[]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchKundalis();
  }, [user]);

  const createKundali = async (input: KundaliInput) => {
    if (!user) {
      toast.error('Please sign in to save your kundali');
      return null;
    }

    const { data, error: insertError } = await supabase
      .from('kundalis')
      .insert({
        user_id: user.id,
        name: input.name,
        gender: input.gender,
        date_of_birth: input.date_of_birth,
        time_of_birth: input.time_of_birth,
        place_of_birth: input.place_of_birth,
        timezone: input.timezone,
        latitude: input.latitude || null,
        longitude: input.longitude || null,
      })
      .select()
      .single();

    if (insertError) {
      toast.error('Failed to save kundali');
      return null;
    }

    toast.success('Kundali saved successfully!');
    setKundalis((prev) => [data as Kundali, ...prev]);
    return data as Kundali;
  };

  const updateKundali = async (id: string, updates: Partial<Kundali>) => {
    const { data, error: updateError } = await supabase
      .from('kundalis')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      toast.error('Failed to update kundali');
      return null;
    }

    toast.success('Kundali updated!');
    setKundalis((prev) =>
      prev.map((k) => (k.id === id ? (data as Kundali) : k))
    );
    return data as Kundali;
  };

  const deleteKundali = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('kundalis')
      .delete()
      .eq('id', id);

    if (deleteError) {
      toast.error('Failed to delete kundali');
      return false;
    }

    toast.success('Kundali deleted');
    setKundalis((prev) => prev.filter((k) => k.id !== id));
    return true;
  };

  return {
    kundalis,
    isLoading,
    error,
    createKundali,
    updateKundali,
    deleteKundali,
    refetch: fetchKundalis,
  };
};
