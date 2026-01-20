import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StarField } from '@/components/StarField';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, User, Calendar, Clock, MapPin, Sparkles, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Disclaimer } from '@/components/Disclaimer';

interface PersonDetails {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

interface MatchResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  gunas: {
    name: string;
    nameHindi: string;
    score: number;
    maxScore: number;
    description: string;
    status: 'excellent' | 'good' | 'average' | 'poor';
  }[];
  recommendation: string;
  compatibility: 'Excellent' | 'Good' | 'Average' | 'Below Average';
}

const MatchMaking = () => {
  const [brideName, setBrideName] = useState<PersonDetails>({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
  });

  const [groomName, setGroomName] = useState<PersonDetails>({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  // Deterministic simulation based on name lengths for demo purposes
  const getDeterministicScore = (str1: string, str2: string, max: number) => {
    const combined = str1.toLowerCase() + str2.toLowerCase();
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash |= 0;
    }
    // Normalize to 0-1 range then scale
    const normalized = (Math.abs(hash) % 100) / 100;
    // Skew towards "Good" for better UX in demo, but still variable
    return Math.floor(normalized * max * 0.5) + Math.floor(max * 0.5);
  };

  const calculateMatch = () => {
    if (!brideName.name || !brideName.dateOfBirth || !groomName.name || !groomName.dateOfBirth) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    // Simulate calculation time
    setTimeout(() => {
      const gunas = [
        { name: 'Varna', nameHindi: 'वर्ण', maxScore: 1, description: 'Spiritual compatibility & ego levels' },
        { name: 'Vashya', nameHindi: 'वश्य', maxScore: 2, description: 'Mutual attraction & dominance' },
        { name: 'Tara', nameHindi: 'तारा', maxScore: 3, description: 'Birth star compatibility & health' },
        { name: 'Yoni', nameHindi: 'योनि', maxScore: 4, description: 'Physical & sexual compatibility' },
        { name: 'Graha Maitri', nameHindi: 'ग्रह मैत्री', maxScore: 5, description: 'Mental compatibility & friendship' },
        { name: 'Gana', nameHindi: 'गण', maxScore: 6, description: 'Temperament & nature compatibility' },
        { name: 'Bhakoot', nameHindi: 'भकूट', maxScore: 7, description: 'Love, family welfare & finances' },
        { name: 'Nadi', nameHindi: 'नाड़ी', maxScore: 8, description: 'Health, genes & progeny' },
      ];

      // Deterministic calculation for demo
      const calculatedGunas = gunas.map(guna => {
        const score = getDeterministicScore(brideName.name + guna.name, groomName.name, guna.maxScore);
        const percentage = (score / guna.maxScore) * 100;
        let status: 'excellent' | 'good' | 'average' | 'poor';
        if (percentage >= 75) status = 'excellent';
        else if (percentage >= 50) status = 'good';
        else if (percentage >= 25) status = 'average';
        else status = 'poor';

        return { ...guna, score, status };
      });

      const totalScore = calculatedGunas.reduce((sum, g) => sum + g.score, 0);
      const maxScore = 36;
      const percentage = Math.round((totalScore / maxScore) * 100);

      let compatibility: 'Excellent' | 'Good' | 'Average' | 'Below Average';
      let recommendation: string;

      if (totalScore >= 28) {
        compatibility = 'Excellent';
        recommendation = 'This is an excellent match! The stars are highly favorable for this union. The couple is likely to enjoy a harmonious, prosperous, and fulfilling married life together.';
      } else if (totalScore >= 18) {
        compatibility = 'Good';
        recommendation = 'This is a good match with favorable prospects. Minor remedies may be suggested to strengthen the bond. Overall, the couple can expect a happy and successful marriage.';
      } else {
        compatibility = 'Average';
        recommendation = 'This match shows moderate compatibility. Certain remedies and careful consideration of both charts is recommended. With effort and understanding, the marriage can be successful.';
      }

      setResult({
        totalScore,
        maxScore,
        percentage,
        gunas: calculatedGunas,
        recommendation,
        compatibility,
      });

      setIsLoading(false);
      toast.success('Match analysis complete!');
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case 'good':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'average':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <XCircle className="w-5 h-5 text-destructive" />;
    }
  };

  const getCompatibilityColor = (compatibility: string) => {
    switch (compatibility) {
      case 'Excellent':
        return 'text-accent';
      case 'Good':
        return 'text-primary';
      case 'Average':
        return 'text-yellow-500';
      default:
        return 'text-destructive';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <StarField />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
              <Heart className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Kundali Matching</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ashtakoot Match Making
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The ancient Vedic method of checking marriage compatibility through 36 Gunas (qualities)
            </p>
          </div>

          {!result ? (
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Bride Details */}
                <Card className="bg-card border-border/50">
                  <CardHeader className="text-center border-b border-border/50">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-destructive/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-destructive" />
                    </div>
                    <CardTitle className="font-serif">Bride Details</CardTitle>
                    <CardDescription>Enter the bride's birth information</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <User className="w-4 h-4 text-accent" />
                        Full Name *
                      </Label>
                      <Input
                        placeholder="Bride's full name"
                        value={brideName.name}
                        onChange={(e) => setBrideName({ ...brideName, name: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent" />
                        Date of Birth *
                      </Label>
                      <Input
                        type="date"
                        value={brideName.dateOfBirth}
                        onChange={(e) => setBrideName({ ...brideName, dateOfBirth: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        Time of Birth
                      </Label>
                      <Input
                        type="time"
                        value={brideName.timeOfBirth}
                        onChange={(e) => setBrideName({ ...brideName, timeOfBirth: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        Place of Birth
                      </Label>
                      <Input
                        placeholder="City, State"
                        value={brideName.placeOfBirth}
                        onChange={(e) => setBrideName({ ...brideName, placeOfBirth: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Groom Details */}
                <Card className="bg-card border-border/50">
                  <CardHeader className="text-center border-b border-border/50">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-serif">Groom Details</CardTitle>
                    <CardDescription>Enter the groom's birth information</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <User className="w-4 h-4 text-accent" />
                        Full Name *
                      </Label>
                      <Input
                        placeholder="Groom's full name"
                        value={groomName.name}
                        onChange={(e) => setGroomName({ ...groomName, name: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent" />
                        Date of Birth *
                      </Label>
                      <Input
                        type="date"
                        value={groomName.dateOfBirth}
                        onChange={(e) => setGroomName({ ...groomName, dateOfBirth: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        Time of Birth
                      </Label>
                      <Input
                        type="time"
                        value={groomName.timeOfBirth}
                        onChange={(e) => setGroomName({ ...groomName, timeOfBirth: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        Place of Birth
                      </Label>
                      <Input
                        placeholder="City, State"
                        value={groomName.placeOfBirth}
                        onChange={(e) => setGroomName({ ...groomName, placeOfBirth: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button
                  variant="hero"
                  size="xl"
                  onClick={calculateMatch}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">☉</span>
                      Analyzing Compatibility...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5" />
                      Check Compatibility
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
              {/* Score Card */}
              <Card className="bg-card border-border/50 mb-8">
                <CardHeader className="text-center border-b border-border/50">
                  <div className="flex justify-center gap-4 mb-4">
                    <Badge variant="outline" className="gap-1">
                      <User className="w-3 h-3" />
                      {brideName.name}
                    </Badge>
                    <Heart className="w-6 h-6 text-destructive animate-pulse" />
                    <Badge variant="outline" className="gap-1">
                      <User className="w-3 h-3" />
                      {groomName.name}
                    </Badge>
                  </div>
                  <CardTitle className="font-serif text-4xl">
                    <span className={getCompatibilityColor(result.compatibility)}>{result.totalScore}</span>
                    <span className="text-muted-foreground text-2xl">/{result.maxScore}</span>
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Guna Milan Score • <span className={getCompatibilityColor(result.compatibility)}>{result.compatibility} Match</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Progress value={result.percentage} className="h-4 mb-4" />
                  <p className="text-center text-muted-foreground">{result.percentage}% Compatibility</p>
                </CardContent>
              </Card>

              {/* Detailed Guna Analysis */}
              <Card className="bg-card border-border/50 mb-8">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Star className="w-5 h-5 text-accent" />
                    Ashtakoot Analysis (अष्टकूट मिलान)
                  </CardTitle>
                  <CardDescription>Detailed breakdown of all 8 matching criteria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.gunas.map((guna) => (
                      <div key={guna.name} className="p-4 bg-background rounded-lg border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(guna.status)}
                            <div>
                              <p className="font-semibold">{guna.name} ({guna.nameHindi})</p>
                              <p className="text-sm text-muted-foreground">{guna.description}</p>
                            </div>
                          </div>
                          <Badge variant={guna.status === 'excellent' || guna.status === 'good' ? 'default' : 'secondary'}>
                            {guna.score}/{guna.maxScore}
                          </Badge>
                        </div>
                        <Progress value={(guna.score / guna.maxScore) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendation */}
              <Card className="bg-card border-accent/30 mb-8">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    Astrologer's Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{result.recommendation}</p>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setResult(null)}
                  className="mr-4"
                >
                  Check Another Match
                </Button>
                <Button variant="hero" size="lg">
                  Consult Astrologer
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MatchMaking;