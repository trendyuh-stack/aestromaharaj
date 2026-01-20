import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StarField } from '@/components/StarField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Calendar, Clock, MapPin, User, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { geocodePlace } from '@/lib/geocoding';
import { useAuth } from '@/hooks/useAuth';
import { KundaliFormData, KundaliResult } from '@/types/kundali';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CITIES_LIST } from '@/lib/geocoding';

const KundaliForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<KundaliFormData>({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    country: 'india',
    timezone: 'Asia/Kolkata',
  });
  const [open, setOpen] = useState(false);

  // Filter relevant cities based on country (optional optimization)
  // For now, we show all, or we could filter based on the country selection
  const filteredCities = CITIES_LIST;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.gender || !formData.dateOfBirth || !formData.timeOfBirth || !formData.placeOfBirth) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // Geocode the place to get coordinates
      toast.info('Finding location coordinates...');
      const geoResult = await geocodePlace(formData.placeOfBirth, formData.country);

      if (!geoResult) {
        toast.error('Could not find the location. Please check the place name.');
        setIsLoading(false);
        return;
      }

      const { latitude, longitude, timezone } = geoResult;

      // Call the edge function for kundali calculation
      toast.info('Calculating planetary positions...');
      const { data, error } = await supabase.functions.invoke('calculate-kundali', {
        body: {
          dateOfBirth: formData.dateOfBirth,
          timeOfBirth: formData.timeOfBirth,
          latitude,
          longitude,
          timezone: timezone || formData.timezone,
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        toast.error('Failed to calculate kundali. Please try again.');
        setIsLoading(false);
        return;
      }

      const kundaliData = data as KundaliResult;

      // Save to database if user is logged in
      if (user) {
        const { error: saveError } = await supabase
          .from('kundalis')
          .insert([{
            user_id: user.id,
            name: formData.fullName,
            gender: formData.gender,
            date_of_birth: formData.dateOfBirth,
            time_of_birth: formData.timeOfBirth,
            place_of_birth: formData.placeOfBirth,
            timezone: timezone || formData.timezone,
            latitude,
            longitude,
            lagna: kundaliData.lagna.sign,
            rashi: kundaliData.moonSign.sign,
            nakshatra: kundaliData.moonNakshatra.name,
            planetary_positions: kundaliData.planets as unknown as Record<string, unknown>,
            houses: kundaliData.houses as unknown as Record<string, unknown>,
            chart_data: kundaliData.charts as unknown as Record<string, unknown>,
            predictions: kundaliData.dashas as unknown as Record<string, unknown>,
          }]);

        if (saveError) {
          console.error('Save error:', saveError);
          // Continue anyway, just don't save
        }
      }

      setIsLoading(false);
      toast.success('Kundali generated successfully!');
      navigate('/kundali/result', {
        state: {
          formData: { ...formData, latitude, longitude, timezone },
          kundaliData
        }
      });
    } catch (err) {
      console.error('Error:', err);
      toast.error('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <StarField />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Free Kundali Generation</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Generate Your Kundali
              </h1>
              <p className="text-muted-foreground">
                Enter your birth details to get your accurate Vedic birth chart with real astronomical calculations
              </p>
            </div>

            <Card className="bg-card border-border/50 shadow-lg">
              <CardHeader className="text-center border-b border-border/50 pb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <Star className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="font-serif text-2xl">Birth Details</CardTitle>
                <CardDescription>
                  Accurate birth information ensures precise calculations
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-accent" />
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="w-4 h-4 text-accent" />
                      Gender *
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent" />
                        Date of Birth *
                      </Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeOfBirth" className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        Time of Birth *
                      </Label>
                      <Input
                        id="timeOfBirth"
                        type="time"
                        value={formData.timeOfBirth}
                        onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="placeOfBirth" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      Place of Birth *
                    </Label>
                    <div className="space-y-2 flex flex-col">
                      <Label htmlFor="placeOfBirth" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        Place of Birth *
                      </Label>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between bg-background border-input hover:bg-accent/5"
                          >
                            {formData.placeOfBirth
                              ? formData.placeOfBirth.charAt(0).toUpperCase() + formData.placeOfBirth.slice(1)
                              : "Select city..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Search city..." />
                            <CommandList>
                              <CommandEmpty>No city found.</CommandEmpty>
                              <CommandGroup>
                                {filteredCities.map((city) => (
                                  <CommandItem
                                    key={city}
                                    value={city}
                                    onSelect={(currentValue) => {
                                      setFormData({ ...formData, placeOfBirth: currentValue });
                                      setOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        formData.placeOfBirth.toLowerCase() === city.toLowerCase() ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {city.charAt(0).toUpperCase() + city.slice(1)}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      Country
                    </Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => setFormData({ ...formData, country: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="canada">Canada</SelectItem>
                        <SelectItem value="australia">Australia</SelectItem>
                        <SelectItem value="uae">UAE</SelectItem>
                        <SelectItem value="singapore">Singapore</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    className="w-full mt-8"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin mr-2">☉</span>
                        Calculating Kundali...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate My Kundali
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <p className="text-center text-sm text-muted-foreground mt-6">
              🔒 Your birth data is securely processed. {!user && 'Sign in to save your kundalis.'}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KundaliForm;
