import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StarField } from '@/components/StarField';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Sun, Moon, Star, Clock, Sunrise, Sunset, ArrowRight, Sparkles } from 'lucide-react';

const Panchang = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Calculate panchang based on date (simplified calculation for demo)
  const calculatePanchang = (date: Date) => {
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'];
    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
    const yogas = ['Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'];
    const karanas = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'];
    const paksha = dayOfYear % 30 < 15 ? 'Shukla' : 'Krishna';
    const weekdays = ['Ravivaar (Sunday)', 'Somvaar (Monday)', 'Mangalvaar (Tuesday)', 'Budhvaar (Wednesday)', 'Guruvaar (Thursday)', 'Shukravaar (Friday)', 'Shanivaar (Saturday)'];
    const months = ['Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashwina', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'];
    
    return {
      tithi: {
        name: tithis[(dayOfYear % 15)],
        paksha,
        endTime: `${6 + (dayOfYear % 12)}:${(dayOfYear % 60).toString().padStart(2, '0')} AM`,
      },
      nakshatra: {
        name: nakshatras[dayOfYear % 27],
        lord: ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'][dayOfYear % 9],
        endTime: `${10 + (dayOfYear % 14)}:${(dayOfYear % 60).toString().padStart(2, '0')} AM`,
      },
      yoga: {
        name: yogas[dayOfYear % 27],
        endTime: `${8 + (dayOfYear % 16)}:${(dayOfYear % 60).toString().padStart(2, '0')} AM`,
      },
      karana: {
        name: karanas[dayOfYear % 11],
        endTime: `${12 + (dayOfYear % 12)}:${(dayOfYear % 60).toString().padStart(2, '0')} PM`,
      },
      weekday: weekdays[date.getDay()],
      hinduMonth: months[(date.getMonth() + 10) % 12],
      sunrise: '06:15 AM',
      sunset: '06:45 PM',
      moonrise: `${7 + (dayOfYear % 5)}:${(dayOfYear % 60).toString().padStart(2, '0')} PM`,
      moonset: `${5 + (dayOfYear % 3)}:${(dayOfYear % 60).toString().padStart(2, '0')} AM`,
      rahuKaal: '07:30 AM - 09:00 AM',
      gulikaKaal: '03:00 PM - 04:30 PM',
      yamagandaKaal: '12:00 PM - 01:30 PM',
      abhijitMuhurta: '11:45 AM - 12:33 PM',
      amritKaal: '02:15 PM - 03:45 PM',
    };
  };
  
  const panchang = calculatePanchang(selectedDate);
  const formattedDate = selectedDate.toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <StarField />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Daily Panchang</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Hindu Panchang (पंचांग)
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The five elements of the Vedic calendar - your daily spiritual guide for auspicious timings
            </p>
          </div>
          
          {/* Date Selector */}
          <div className="flex justify-center gap-4 mb-12">
            <Button
              variant="outline"
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 86400000))}
            >
              ← Previous Day
            </Button>
            <div className="flex items-center gap-2 px-6 py-2 bg-card border border-border/50 rounded-lg">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="font-medium text-foreground">{formattedDate}</span>
            </div>
            <Button
              variant="outline"
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 86400000))}
            >
              Next Day →
            </Button>
          </div>
          
          {/* Panchang Header */}
          <Card className="bg-card border-border/50 mb-8 max-w-4xl mx-auto">
            <CardHeader className="text-center border-b border-border/50">
              <CardTitle className="font-serif text-2xl">{panchang.weekday}</CardTitle>
              <CardDescription>
                {panchang.hinduMonth} Month • {panchang.tithi.paksha} Paksha
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-accent/5 rounded-lg">
                  <Sunrise className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Sunrise</p>
                  <p className="font-semibold">{panchang.sunrise}</p>
                </div>
                <div className="text-center p-4 bg-accent/5 rounded-lg">
                  <Sunset className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Sunset</p>
                  <p className="font-semibold">{panchang.sunset}</p>
                </div>
                <div className="text-center p-4 bg-accent/5 rounded-lg">
                  <Moon className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Moonrise</p>
                  <p className="font-semibold">{panchang.moonrise}</p>
                </div>
                <div className="text-center p-4 bg-accent/5 rounded-lg">
                  <Moon className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Moonset</p>
                  <p className="font-semibold">{panchang.moonset}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Five Elements */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-accent" />
                    Tithi (तिथि)
                  </span>
                  <Badge variant="outline">{panchang.tithi.paksha}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-serif font-bold text-foreground mb-2">{panchang.tithi.name}</p>
                <p className="text-sm text-muted-foreground">Ends at {panchang.tithi.endTime}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  Nakshatra (नक्षत्र)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-serif font-bold text-foreground mb-2">{panchang.nakshatra.name}</p>
                <p className="text-sm text-muted-foreground">Lord: {panchang.nakshatra.lord} • Ends at {panchang.nakshatra.endTime}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <Sun className="w-5 h-5 text-accent" />
                  Yoga (योग)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-serif font-bold text-foreground mb-2">{panchang.yoga.name}</p>
                <p className="text-sm text-muted-foreground">Ends at {panchang.yoga.endTime}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  Karana (करण)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-serif font-bold text-foreground mb-2">{panchang.karana.name}</p>
                <p className="text-sm text-muted-foreground">Ends at {panchang.karana.endTime}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border/50 md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Auspicious Timings (शुभ मुहूर्त)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <p className="text-xs text-muted-foreground">Abhijit Muhurta</p>
                    <p className="font-semibold text-accent">{panchang.abhijitMuhurta}</p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <p className="text-xs text-muted-foreground">Amrit Kaal</p>
                    <p className="font-semibold text-accent">{panchang.amritKaal}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Inauspicious Timings */}
          <Card className="bg-card border-destructive/30 max-w-4xl mx-auto">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg text-destructive">
                ⚠️ Inauspicious Timings (Avoid Important Tasks)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <p className="text-sm text-muted-foreground">Rahu Kaal</p>
                  <p className="font-semibold text-destructive">{panchang.rahuKaal}</p>
                </div>
                <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <p className="text-sm text-muted-foreground">Gulika Kaal</p>
                  <p className="font-semibold text-destructive">{panchang.gulikaKaal}</p>
                </div>
                <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <p className="text-sm text-muted-foreground">Yamaganda Kaal</p>
                  <p className="font-semibold text-destructive">{panchang.yamagandaKaal}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Panchang;