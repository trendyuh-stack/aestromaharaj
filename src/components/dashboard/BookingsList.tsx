import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { BookingWithDetails } from '@/types/database';
import {
  Calendar,
  Clock,
  Video,
  X,
  IndianRupee,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';

interface BookingsListProps {
  title: string;
  bookings: BookingWithDetails[];
  isLoading: boolean;
  showCancelButton?: boolean;
  onCancel?: (id: string) => Promise<boolean>;
  emptyMessage: string;
  icon: React.ReactNode;
}

const getStatusBadge = (status: string, paymentStatus: string) => {
  if (status === 'cancelled') {
    return <Badge variant="destructive">Cancelled</Badge>;
  }
  if (status === 'completed') {
    return <Badge className="bg-green-500/10 text-green-500 border-green-500/30">Completed</Badge>;
  }
  if (paymentStatus === 'pending') {
    return <Badge variant="secondary">Payment Pending</Badge>;
  }
  if (status === 'confirmed') {
    return <Badge className="bg-primary/10 text-primary border-primary/30">Confirmed</Badge>;
  }
  return <Badge variant="secondary">{status}</Badge>;
};

const BookingsList = ({
  title,
  bookings,
  isLoading,
  showCancelButton = false,
  onCancel,
  emptyMessage,
  icon,
}: BookingsListProps) => {
  if (isLoading) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse h-32 bg-muted rounded-lg"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-serif flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        {title.includes('Upcoming') && (
          <Button asChild variant="outline" size="sm">
            <Link to="/astrologers">Book Consultation</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{emptyMessage}</p>
            <Button asChild variant="hero">
              <Link to="/astrologers">Browse Astrologers</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 bg-background rounded-lg border border-border/50"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Astrologer Info */}
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="w-12 h-12 border-2 border-accent/30">
                      <AvatarImage
                        src={booking.astrologer?.avatar_url || ''}
                        alt={booking.astrologer?.name}
                      />
                      <AvatarFallback className="bg-accent/10 text-accent">
                        {booking.astrologer?.name?.[0] || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-foreground">
                          {booking.astrologer?.name || 'Unknown Astrologer'}
                        </h4>
                        {getStatusBadge(booking.status, booking.payment_status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {booking.astrologer?.expertise?.slice(0, 2).join(', ')}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(booking.scheduled_at), 'dd MMM yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(booking.scheduled_at), 'hh:mm a')}
                        </span>
                        <span className="flex items-center gap-1">
                          <IndianRupee className="w-4 h-4" />
                          {booking.payment_amount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {booking.meet_link && booking.status === 'confirmed' && (
                      <Button
                        asChild
                        variant="hero"
                        size="sm"
                      >
                        <a
                          href={booking.meet_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join Meeting
                        </a>
                      </Button>
                    )}
                    {showCancelButton &&
                      booking.status !== 'cancelled' &&
                      booking.status !== 'completed' &&
                      onCancel && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cancel Booking
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this
                                consultation with{' '}
                                {booking.astrologer?.name}? This action cannot
                                be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onCancel(booking.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Cancel Booking
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingsList;
