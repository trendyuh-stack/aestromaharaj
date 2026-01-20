import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StarField } from '@/components/StarField';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardStats from '@/components/dashboard/DashboardStats';
import KundaliList from '@/components/dashboard/KundaliList';
import BookingsList from '@/components/dashboard/BookingsList';
import { useAuth } from '@/hooks/useAuth';
import { useKundalis } from '@/hooks/useKundalis';
import { useBookings } from '@/hooks/useBookings';
import { Star, Calendar, History, LogOut, Settings, User } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading, signOut } = useAuth();
  const { kundalis, isLoading: kundalisLoading, deleteKundali } = useKundalis();
  const {
    upcomingBookings,
    pastBookings,
    isLoading: bookingsLoading,
    cancelBooking,
  } = useBookings();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <Star className="w-12 h-12 text-accent mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const completedConsultations = pastBookings.filter(
    (b) => b.status === 'completed'
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <StarField />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-accent/30">
                <AvatarImage
                  src={profile?.avatar_url || ''}
                  alt={profile?.full_name || 'User'}
                />
                <AvatarFallback className="bg-accent/10 text-accent text-xl">
                  {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                  Welcome, {profile?.full_name || 'User'}
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats */}
          <DashboardStats
            totalKundalis={kundalis.length}
            upcomingBookings={upcomingBookings.length}
            completedConsultations={completedConsultations}
          />

          {/* Main Content Tabs */}
          <Tabs defaultValue="kundalis" className="mt-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
              <TabsTrigger value="kundalis" className="gap-2">
                <Star className="w-4 h-4" />
                <span className="hidden sm:inline">Kundalis</span>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Upcoming</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="kundalis">
              <KundaliList
                kundalis={kundalis}
                isLoading={kundalisLoading}
                onDelete={deleteKundali}
              />
            </TabsContent>

            <TabsContent value="upcoming">
              <BookingsList
                title="Upcoming Consultations"
                bookings={upcomingBookings}
                isLoading={bookingsLoading}
                showCancelButton
                onCancel={cancelBooking}
                emptyMessage="No upcoming consultations scheduled"
                icon={<Calendar className="w-5 h-5 text-primary" />}
              />
            </TabsContent>

            <TabsContent value="history">
              <BookingsList
                title="Booking History"
                bookings={pastBookings}
                isLoading={bookingsLoading}
                emptyMessage="No past consultations yet"
                icon={<History className="w-5 h-5 text-muted-foreground" />}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
