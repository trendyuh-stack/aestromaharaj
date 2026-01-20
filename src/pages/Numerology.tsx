import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StarField } from '@/components/StarField';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Hash, Calendar, User, Sparkles, Heart, Briefcase, TrendingUp, Star } from 'lucide-react';
import { toast } from 'sonner';

interface NumerologyResult {
  lifePathNumber: number;
  destinyNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  birthdayNumber: number;
  interpretation: {
    lifePath: string;
    destiny: string;
    soulUrge: string;
    personality: string;
  };
  luckyDays: string[];
  luckyColors: string[];
  compatibleNumbers: number[];
}

const numberMeanings: Record<number, { title: string; traits: string; career: string; love: string }> = {
  1: {
    title: 'The Leader',
    traits: 'Independent, ambitious, creative, pioneering, and determined. Natural born leader with strong willpower.',
    career: 'Best suited for entrepreneurship, management, politics, or any field requiring leadership and innovation.',
    love: 'Needs a partner who respects their independence. Compatible with 1, 3, 5, and 9.',
  },
  2: {
    title: 'The Diplomat',
    traits: 'Cooperative, sensitive, balanced, diplomatic, and intuitive. Natural peacemaker with emotional depth.',
    career: 'Excels in counseling, teaching, healing arts, diplomacy, or any collaborative environment.',
    love: 'Seeks harmony and partnership. Most compatible with 2, 4, 6, and 8.',
  },
  3: {
    title: 'The Communicator',
    traits: 'Creative, expressive, optimistic, social, and artistic. Natural entertainer with infectious energy.',
    career: 'Thrives in arts, entertainment, writing, public speaking, or marketing.',
    love: 'Needs intellectual stimulation and fun. Compatible with 1, 3, 5, and 9.',
  },
  4: {
    title: 'The Builder',
    traits: 'Practical, organized, disciplined, reliable, and hardworking. Creates lasting foundations.',
    career: 'Suited for engineering, architecture, management, accounting, or any structured profession.',
    love: 'Values stability and commitment. Most compatible with 2, 4, 6, and 8.',
  },
  5: {
    title: 'The Freedom Seeker',
    traits: 'Adventurous, versatile, dynamic, curious, and adaptable. Embraces change and variety.',
    career: 'Excels in travel, sales, media, entertainment, or any dynamic field.',
    love: 'Needs freedom and excitement. Compatible with 1, 3, 5, and 7.',
  },
  6: {
    title: 'The Nurturer',
    traits: 'Responsible, caring, harmonious, domestic, and protective. Natural caregiver and healer.',
    career: 'Thrives in healthcare, education, counseling, hospitality, or community service.',
    love: 'Devoted and loving partner. Most compatible with 2, 4, 6, and 9.',
  },
  7: {
    title: 'The Seeker',
    traits: 'Analytical, spiritual, introspective, wise, and intuitive. Seeks deeper truths and meaning.',
    career: 'Suited for research, science, philosophy, spirituality, or investigative work.',
    love: 'Needs intellectual and spiritual connection. Compatible with 5, 7, and 9.',
  },
  8: {
    title: 'The Achiever',
    traits: 'Ambitious, authoritative, successful, material-minded, and powerful. Natural executive.',
    career: 'Excels in business, finance, law, real estate, or corporate leadership.',
    love: 'Seeks stability and success in partner. Most compatible with 2, 4, and 8.',
  },
  9: {
    title: 'The Humanitarian',
    traits: 'Compassionate, generous, idealistic, creative, and wise. Dedicated to serving humanity.',
    career: 'Thrives in humanitarian work, arts, healing, teaching, or global initiatives.',
    love: 'Needs a partner who shares their ideals. Compatible with 1, 3, 6, and 9.',
  },
};

const Numerology = () => {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NumerologyResult | null>(null);

  const reduceToSingleDigit = (num: number): number => {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = num.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
    }
    return num > 9 ? reduceToSingleDigit(num) : num;
  };

  const calculateLifePath = (dob: string): number => {
    const digits = dob.replace(/-/g, '').split('').map(Number);
    const sum = digits.reduce((a, b) => a + b, 0);
    return reduceToSingleDigit(sum);
  };

  const letterToNumber = (letter: string): number => {
    const values: Record<string, number> = {
      a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
      j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
      s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
    };
    return values[letter.toLowerCase()] || 0;
  };

  const calculateDestiny = (fullName: string): number => {
    const sum = fullName.split('').reduce((acc, char) => acc + letterToNumber(char), 0);
    return reduceToSingleDigit(sum);
  };

  const calculateSoulUrge = (fullName: string): number => {
    const vowels = 'aeiou';
    const sum = fullName.split('')
      .filter(char => vowels.includes(char.toLowerCase()))
      .reduce((acc, char) => acc + letterToNumber(char), 0);
    return reduceToSingleDigit(sum);
  };

  const calculatePersonality = (fullName: string): number => {
    const vowels = 'aeiou';
    const sum = fullName.split('')
      .filter(char => !vowels.includes(char.toLowerCase()) && /[a-z]/i.test(char))
      .reduce((acc, char) => acc + letterToNumber(char), 0);
    return reduceToSingleDigit(sum);
  };

  const calculateBirthdayNumber = (dob: string): number => {
    const day = parseInt(dob.split('-')[2]);
    return reduceToSingleDigit(day);
  };

  const calculateNumerology = () => {
    if (!name.trim() || !dateOfBirth) {
      toast.error('Please enter your name and date of birth');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const lifePathNumber = calculateLifePath(dateOfBirth);
      const destinyNumber = calculateDestiny(name);
      const soulUrgeNumber = calculateSoulUrge(name);
      const personalityNumber = calculatePersonality(name);
      const birthdayNumber = calculateBirthdayNumber(dateOfBirth);

      const lifePath = numberMeanings[lifePathNumber] || numberMeanings[1];
      const destiny = numberMeanings[destinyNumber] || numberMeanings[1];
      const soulUrge = numberMeanings[soulUrgeNumber] || numberMeanings[1];
      const personality = numberMeanings[personalityNumber] || numberMeanings[1];

      setResult({
        lifePathNumber,
        destinyNumber,
        soulUrgeNumber,
        personalityNumber,
        birthdayNumber,
        interpretation: {
          lifePath: lifePath.traits,
          destiny: destiny.career,
          soulUrge: soulUrge.love,
          personality: personality.traits,
        },
        luckyDays: ['Tuesday', 'Friday', 'Sunday'],
        luckyColors: ['Gold', 'Orange', 'Yellow'],
        compatibleNumbers: [1, 3, 5, 9].filter(n => n !== lifePathNumber).slice(0, 3),
      });

      setIsLoading(false);
      toast.success('Numerology analysis complete!');
    }, 1500);
  };

  const getNumberInfo = (num: number) => numberMeanings[num] || numberMeanings[1];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <StarField />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
              <Hash className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Numerology</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Discover Your Numbers
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Unlock the mystical power of numbers and understand your life's purpose, destiny, and personality
            </p>
          </div>

          {!result ? (
            <Card className="bg-card border-border/50 max-w-lg mx-auto">
              <CardHeader className="text-center border-b border-border/50">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <Hash className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="font-serif text-2xl">Enter Your Details</CardTitle>
                <CardDescription>Your name and birth date reveal your core numbers</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4 text-accent" />
                    Full Name (as per birth certificate) *
                  </Label>
                  <Input
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <Button
                  variant="hero"
                  size="xl"
                  className="w-full"
                  onClick={calculateNumerology}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">☉</span>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Reveal My Numbers
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
              {/* Core Numbers */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {[
                  { label: 'Life Path', number: result.lifePathNumber, icon: TrendingUp },
                  { label: 'Destiny', number: result.destinyNumber, icon: Star },
                  { label: 'Soul Urge', number: result.soulUrgeNumber, icon: Heart },
                  { label: 'Personality', number: result.personalityNumber, icon: User },
                  { label: 'Birthday', number: result.birthdayNumber, icon: Calendar },
                ].map((item) => (
                  <Card key={item.label} className="bg-card border-border/50 text-center">
                    <CardContent className="pt-6">
                      <item.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-4xl font-serif font-bold text-accent">{item.number}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Life Path Interpretation */}
              <Card className="bg-card border-accent/30 mb-8">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Life Path Number {result.lifePathNumber}: {getNumberInfo(result.lifePathNumber).title}
                  </CardTitle>
                  <CardDescription>Your life's purpose and the path you're meant to walk</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed mb-4">{result.interpretation.lifePath}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-background rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span className="font-medium">Career Path</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{result.interpretation.destiny}</p>
                    </div>
                    <div className="p-4 bg-background rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-destructive" />
                        <span className="font-medium">Love & Relationships</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{result.interpretation.soulUrge}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lucky Elements */}
              <Card className="bg-card border-border/50 mb-8">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    Your Lucky Elements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Lucky Days</p>
                      <div className="flex flex-wrap gap-2">
                        {result.luckyDays.map((day) => (
                          <Badge key={day} variant="outline">{day}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Lucky Colors</p>
                      <div className="flex flex-wrap gap-2">
                        {result.luckyColors.map((color) => (
                          <Badge key={color} variant="outline">{color}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Compatible Numbers</p>
                      <div className="flex flex-wrap gap-2">
                        {result.compatibleNumbers.map((num) => (
                          <Badge key={num} className="bg-accent/20 text-accent">{num}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button variant="outline" size="lg" onClick={() => setResult(null)}>
                  Calculate Again
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

export default Numerology;