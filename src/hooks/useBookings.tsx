import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Booking, BookingWithDetails } from '@/types/database';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface BookingInput {
  astrologer_id: string;
  kundali_id?: string;
  scheduled_at: string;
  duration_minutes?: number;
  payment_amount: number;
  notes?: string;
}

export const useBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!user) {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('bookings')
      .select(`
        *,
        astrologer:astrologers(*),
        kundali:kundalis(*)
      `)
      .eq('user_id', user.id)
      .order('scheduled_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      toast.error('Failed to load bookings');
    } else {
      setBookings(data as unknown as BookingWithDetails[]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const upcomingBookings = bookings.filter(
    (b) =>
      new Date(b.scheduled_at) > new Date() &&
      (b.status === 'pending' || b.status === 'confirmed')
  );

  const pastBookings = bookings.filter(
    (b) =>
      new Date(b.scheduled_at) <= new Date() ||
      b.status === 'completed' ||
      b.status === 'cancelled'
  );

  const createBooking = async (input: BookingInput) => {
    if (!user) {
      toast.error('Please sign in to book a consultation');
      return null;
    }

    const { data, error: insertError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        astrologer_id: input.astrologer_id,
        kundali_id: input.kundali_id || null,
        scheduled_at: input.scheduled_at,
        duration_minutes: input.duration_minutes || 30,
        payment_amount: input.payment_amount,
        notes: input.notes || null,
        status: 'pending',
        payment_status: 'pending',
      })
      .select(`
        *,
        astrologer:astrologers(*),
        kundali:kundalis(*)
      `)
      .single();

    if (insertError) {
      toast.error('Failed to create booking');
      return null;
    }

    toast.success('Booking created! Please complete payment.');
    setBookings((prev) => [data as unknown as BookingWithDetails, ...prev]);
    return data as unknown as BookingWithDetails;
  };

  const cancelBooking = async (id: string) => {
    const { data, error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select(`
        *,
        astrologer:astrologers(*),
        kundali:kundalis(*)
      `)
      .single();

    if (updateError) {
      toast.error('Failed to cancel booking');
      return false;
    }

    toast.success('Booking cancelled');
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? (data as unknown as BookingWithDetails) : b
      )
    );
    return true;
  };

  return {
    bookings,
    upcomingBookings,
    pastBookings,
    isLoading,
    error,
    createBooking,
    cancelBooking,
    refetch: fetchBookings,
  };
};
