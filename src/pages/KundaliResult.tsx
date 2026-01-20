import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StarField } from '@/components/StarField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  Sun,
  Moon,
  Download,
  Share2,
  Video,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { KundaliResult as KundaliResultType, KundaliFormData } from '@/types/kundali';
import { Disclaimer } from '@/components/Disclaimer';

const ZODIAC_SYMBOLS: Record<string, string> = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
};

const KundaliResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData as KundaliFormData | undefined;
  const kundaliData = location.state?.kundaliData as KundaliResultType | undefined;

  useEffect(() => {
    if (!kundaliData) {
      navigate('/kundali');
    }
  }, [kundaliData, navigate]);

  if (!kundaliData) {
    return null;
  }

  // Rashi Chart SVG with real planetary positions
  const RashiChart = () => {
    const getHousePlanets = (houseNum: number) => {
      return kundaliData.planets
        .filter(p => p.house === houseNum)
        .map(p => {
          const abbrev = p.planet.substring(0, 2);
          return p.isRetrograde ? `${abbrev}(R)` : abbrev;
        })
        .join(' ');
    };

    // House positions in the chart (x, y coordinates for text placement)
    const housePositions = [
      { x: 150, y: 45 },   // House 1 (top center)
      { x: 55, y: 45 },    // House 2
      { x: 25, y: 90 },    // House 3
      { x: 25, y: 150 },   // House 4
      { x: 55, y: 200 },   // House 5
      { x: 55, y: 255 },   // House 6
      { x: 150, y: 255 },  // House 7
      { x: 245, y: 255 },  // House 8
      { x: 275, y: 200 },  // House 9
      { x: 275, y: 150 },  // House 10
      { x: 275, y: 90 },   // House 11
      { x: 245, y: 45 },   // House 12
    ];

    return (
      <svg viewBox="0 0 300 300" className="w-full max-w-sm mx-auto">
        {/* Outer square */}
        <rect x="10" y="10" width="280" height="280" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
        {/* Diagonal lines */}
        <line x1="10" y1="10" x2="150" y2="150" stroke="currentColor" strokeWidth="1" className="text-border" />
        <line x1="290" y1="10" x2="150" y2="150" stroke="currentColor" strokeWidth="1" className="text-border" />
        <line x1="10" y1="290" x2="150" y2="150" stroke="currentColor" strokeWidth="1" className="text-border" />
        <line x1="290" y1="290" x2="150" y2="150" stroke="currentColor" strokeWidth="1" className="text-border" />
        {/* Inner lines */}
        <line x1="80" y1="80" x2="80" y2="220" stroke="currentColor" strokeWidth="1" className="text-border" />
        <line x1="220" y1="80" x2="220" y2="220" stroke="currentColor" strokeWidth="1" className="text-border" />
        <line x1="80" y1="80" x2="220" y2="80" stroke="currentColor" strokeWidth="1" className="text-border" />
        <line x1="80" y1="220" x2="220" y2="220" stroke="currentColor" strokeWidth="1" className="text-border" />

        {/* House numbers and planets */}
        {housePositions.map((pos, idx) => {
          const houseNum = idx + 1;
          const planets = getHousePlanets(houseNum);
          const houseSign = kundaliData.houses[idx]?.sign || '';
          return (
            <g key={houseNum}>
              <text x={pos.x} y={pos.y - 8} textAnchor="middle" className="text-[8px] fill-muted-foreground">
                {houseNum} {ZODIAC_SYMBOLS[houseSign] || ''}
              </text>
              <text x={pos.x} y={pos.y + 8} textAnchor="middle" className="text-[9px] fill-accent font-medium">
                {planets}
              </text>
            </g>
          );
        })}

        {/* Lagna indicator */}
        <text x="150" y="25" textAnchor="middle" className="text-sm font-bold fill-accent">
          Asc: {kundaliData.lagna.sign}
        </text>
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <StarField />

        <div className="container mx-auto px-4 relative z-10">
          {/* Back button */}
          <Link to="/kundali" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent mb-6">
            <ArrowLeft className="w-4 h-4" />
            Generate New Kundali
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
              <Star className="w-4 h-4 text-accent animate-pulse-glow" />
              <span className="text-sm font-medium text-accent">Your Kundali is Ready</span>
            </div>

            <div className="max-w-2xl mx-auto mb-6">
              <Disclaimer type="astrology" />
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Kundali of {formData?.fullName || 'User'}
            </h1>
            <p className="text-muted-foreground">
              Generated on {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })} • Ayanamsa: {kundaliData.ayanamsa.toFixed(4)}°
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Link to="/astrologers">
              <Button variant="hero" className="gap-2">
                <Video className="w-4 h-4" />
                Consult Astrologer
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="bg-card border-border/50 text-center">
              <CardContent className="pt-6">
                <Sun className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Lagna (Ascendant)</p>
                <p className="font-serif font-semibold text-foreground">
                  {kundaliData.lagna.sign} ({kundaliData.lagna.signHindi})
                </p>
                <p className="text-xs text-muted-foreground">{kundaliData.lagna.degree.toFixed(2)}°</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50 text-center">
              <CardContent className="pt-6">
                <Moon className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Moon Sign (Rashi)</p>
                <p className="font-serif font-semibold text-foreground">
                  {kundaliData.moonSign.sign} ({kundaliData.moonSign.signHindi})
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50 text-center">
              <CardContent className="pt-6">
                <Sun className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Sun Sign</p>
                <p className="font-serif font-semibold text-foreground">
                  {kundaliData.sunSign.sign} ({kundaliData.sunSign.signHindi})
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50 text-center">
              <CardContent className="pt-6">
                <Star className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Nakshatra</p>
                <p className="font-serif font-semibold text-foreground">
                  {kundaliData.moonNakshatra.name}
                </p>
                <p className="text-xs text-muted-foreground">Pada {kundaliData.moonNakshatra.pada}</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="chart" className="max-w-5xl mx-auto">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="chart">Birth Chart</TabsTrigger>
              <TabsTrigger value="planets">Planets</TabsTrigger>
              <TabsTrigger value="panchang">Panchang</TabsTrigger>
              <TabsTrigger value="dasha">Dasha</TabsTrigger>
            </TabsList>

            {/* Chart Tab */}
            <TabsContent value="chart">
              <Card className="bg-card border-border/50">
                <CardHeader className="text-center">
                  <CardTitle className="font-serif">Rashi Chart (D1)</CardTitle>
                  <CardDescription>Your Vedic birth chart with real planetary positions</CardDescription>
                </CardHeader>
                <CardContent>
                  <RashiChart />
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Birth Place: {formData?.placeOfBirth} • Lat: {formData?.latitude?.toFixed(4)}°, Long: {formData?.longitude?.toFixed(4)}°
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {kundaliData.planets.filter(p => p.isRetrograde).map(p => (
                        <Badge key={p.planet} variant="outline" className="gap-1">
                          <RotateCcw className="w-3 h-3" />
                          {p.planet} Retrograde
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Planets Tab */}
            <TabsContent value="planets">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Planetary Positions</CardTitle>
                  <CardDescription>Detailed placement of planets in sidereal zodiac (Lahiri Ayanamsa)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Planet</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sign</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Degree</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">House</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nakshatra</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kundaliData.planets.map((planet) => (
                          <tr key={planet.planet} className="border-b border-border/30">
                            <td className="py-3 px-4 font-medium text-foreground">
                              {planet.planet} ({planet.planetHindi})
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {ZODIAC_SYMBOLS[planet.sign]} {planet.sign}
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {planet.degree.toFixed(2)}°
                            </td>
                            <td className="py-3 px-4 text-accent font-medium">{planet.house}</td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {planet.nakshatra} (Pada {planet.nakshatraPada})
                            </td>
                            <td className="py-3 px-4">
                              {planet.isRetrograde && (
                                <Badge variant="secondary" className="gap-1">
                                  <RotateCcw className="w-3 h-3" /> R
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Panchang Tab */}
            <TabsContent value="panchang">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Panchang (पंचांग)</CardTitle>
                  <CardDescription>Five elements of Vedic calendar at birth time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-accent/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">Tithi (तिथि)</p>
                        <p className="font-serif font-semibold text-lg">{kundaliData.panchang.tithi.name}</p>
                      </div>
                      <div className="p-4 bg-accent/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">Nakshatra (नक्षत्र)</p>
                        <p className="font-serif font-semibold text-lg">
                          {kundaliData.panchang.nakshatra.name} ({kundaliData.panchang.nakshatra.hindi})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Lord: {kundaliData.panchang.nakshatra.lord} • Pada: {kundaliData.panchang.nakshatra.pada}
                        </p>
                      </div>
                      <div className="p-4 bg-accent/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">Yoga (योग)</p>
                        <p className="font-serif font-semibold text-lg">{kundaliData.panchang.yoga.name}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-accent/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">Karana (करण)</p>
                        <p className="font-serif font-semibold text-lg">{kundaliData.panchang.karana.name}</p>
                      </div>
                      <div className="p-4 bg-accent/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">Sunrise / Sunset</p>
                        <p className="font-serif font-semibold text-lg">
                          {kundaliData.panchang.sunrise} / {kundaliData.panchang.sunset}
                        </p>
                      </div>
                      <div className="p-4 bg-accent/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">Moon Phase</p>
                        <p className="font-serif font-semibold text-lg">{kundaliData.panchang.moonPhase}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dasha Tab */}
            <TabsContent value="dasha">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Vimshottari Dasha</CardTitle>
                  <CardDescription>Planetary periods based on Moon's nakshatra at birth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {kundaliData.dashas.slice(0, 5).map((dasha, idx) => {
                      const isCurrentDasha = new Date(dasha.mahadashaStart) <= new Date() && new Date(dasha.mahadashaEnd) >= new Date();
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border ${isCurrentDasha ? 'bg-accent/10 border-accent' : 'bg-background border-border/50'}`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-serif font-semibold text-lg">
                              {dasha.mahadasha} Mahadasha
                              {isCurrentDasha && <Badge className="ml-2">Current</Badge>}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {dasha.mahadashaStart} to {dasha.mahadashaEnd}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {dasha.antardashas.slice(0, 5).map((ad, adIdx) => (
                              <Badge key={adIdx} variant="outline" className="text-xs">
                                {ad.name}: {ad.start.slice(0, 7)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-4">
              Want a detailed analysis? Talk to our expert astrologers.
            </p>
            <Link to="/astrologers">
              <Button variant="cosmic" size="lg" className="gap-2">
                <Video className="w-5 h-5" />
                Book Consultation Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KundaliResult;
