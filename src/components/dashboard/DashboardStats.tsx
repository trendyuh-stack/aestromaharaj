import { Card, CardContent } from '@/components/ui/card';
import { Star, Calendar, History, Sparkles } from 'lucide-react';

interface DashboardStatsProps {
  totalKundalis: number;
  upcomingBookings: number;
  completedConsultations: number;
}

const DashboardStats = ({
  totalKundalis,
  upcomingBookings,
  completedConsultations,
}: DashboardStatsProps) => {
  const stats = [
    {
      label: 'Saved Kundalis',
      value: totalKundalis,
      icon: Star,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Upcoming Consultations',
      value: upcomingBookings,
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Completed Sessions',
      value: completedConsultations,
      icon: History,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border/50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
