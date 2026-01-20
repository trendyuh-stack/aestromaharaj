import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StarField } from '@/components/StarField';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Sun, Heart, Briefcase, Sparkles, TrendingUp, Calendar } from 'lucide-react';

const zodiacSigns = [
  { name: 'Aries', symbol: '♈', hindi: 'मेष', dates: 'Mar 21 - Apr 19', element: 'Fire' },
  { name: 'Taurus', symbol: '♉', hindi: 'वृषभ', dates: 'Apr 20 - May 20', element: 'Earth' },
  { name: 'Gemini', symbol: '♊', hindi: 'मिथुन', dates: 'May 21 - Jun 20', element: 'Air' },
  { name: 'Cancer', symbol: '♋', hindi: 'कर्क', dates: 'Jun 21 - Jul 22', element: 'Water' },
  { name: 'Leo', symbol: '♌', hindi: 'सिंह', dates: 'Jul 23 - Aug 22', element: 'Fire' },
  { name: 'Virgo', symbol: '♍', hindi: 'कन्या', dates: 'Aug 23 - Sep 22', element: 'Earth' },
  { name: 'Libra', symbol: '♎', hindi: 'तुला', dates: 'Sep 23 - Oct 22', element: 'Air' },
  { name: 'Scorpio', symbol: '♏', hindi: 'वृश्चिक', dates: 'Oct 23 - Nov 21', element: 'Water' },
  { name: 'Sagittarius', symbol: '♐', hindi: 'धनु', dates: 'Nov 22 - Dec 21', element: 'Fire' },
  { name: 'Capricorn', symbol: '♑', hindi: 'मकर', dates: 'Dec 22 - Jan 19', element: 'Earth' },
  { name: 'Aquarius', symbol: '♒', hindi: 'कुंभ', dates: 'Jan 20 - Feb 18', element: 'Air' },
  { name: 'Pisces', symbol: '♓', hindi: 'मीन', dates: 'Feb 19 - Mar 20', element: 'Water' },
];

const horoscopeData: Record<string, { general: string; love: string; career: string; health: string; luckyNumber: number; luckyColor: string; mood: string }> = {
  'Aries': {
    general: 'Today brings exciting opportunities for personal growth. Your natural leadership qualities will shine bright, drawing others to your vision. Trust your instincts when making important decisions.',
    love: 'Romance is in the air! Single Aries may encounter someone special. Those in relationships should plan a surprise for their partner.',
    career: 'A significant career opportunity awaits. Your innovative ideas will be appreciated by superiors. Stay confident in meetings.',
    health: 'Energy levels are high today. Channel this into physical activity. Avoid overexertion in the evening.',
    luckyNumber: 9,
    luckyColor: 'Red',
    mood: 'Energetic',
  },
  'Taurus': {
    general: 'Stability and comfort are your themes today. Focus on building secure foundations in all areas of life. Financial decisions made today will have long-lasting positive effects.',
    love: 'Emotional connections deepen today. Show appreciation to your loved ones through small gestures.',
    career: 'Steady progress at work. Your reliability makes you a valuable team member. Expect recognition.',
    health: 'Focus on relaxation and self-care. A gentle walk in nature will rejuvenate your spirit.',
    luckyNumber: 6,
    luckyColor: 'Green',
    mood: 'Peaceful',
  },
  'Gemini': {
    general: 'Communication flows easily today. Your wit and charm attract positive attention. Multiple opportunities may present themselves - choose wisely.',
    love: 'Express your feelings openly. Your partner appreciates honest communication. Singles may enjoy flirty conversations.',
    career: 'Networking opportunities abound. Your ideas are well-received in group settings. Consider pitching new projects.',
    health: 'Mental stimulation is key. Engage in puzzles or learning something new to satisfy your curious mind.',
    luckyNumber: 5,
    luckyColor: 'Yellow',
    mood: 'Curious',
  },
  'Cancer': {
    general: 'Emotional intuition guides you perfectly today. Trust your feelings when making decisions. Family matters take priority and bring joy.',
    love: 'Deep emotional bonding is highlighted. Create a cozy atmosphere for quality time with loved ones.',
    career: 'Your nurturing nature helps resolve workplace conflicts. Others seek your advice and support.',
    health: 'Pay attention to emotional well-being. Water-based activities like swimming bring balance.',
    luckyNumber: 2,
    luckyColor: 'Silver',
    mood: 'Nurturing',
  },
  'Leo': {
    general: 'The spotlight finds you naturally today. Your creative talents shine brightly. Take center stage with confidence and grace.',
    love: 'Romance flourishes with grand gestures. Express your love boldly. Plan something memorable.',
    career: 'Leadership opportunities emerge. Your vision inspires the team. Recognition for past efforts arrives.',
    health: 'Heart-pumping exercise boosts your vitality. Dance or sports activities are especially beneficial.',
    luckyNumber: 1,
    luckyColor: 'Gold',
    mood: 'Confident',
  },
  'Virgo': {
    general: 'Detail-oriented tasks flow smoothly today. Your analytical skills solve complex problems. Organization brings peace of mind.',
    love: 'Show love through acts of service. Helping your partner with practical matters strengthens bonds.',
    career: 'Your meticulous work gets noticed. Perfect time for detailed analysis and documentation.',
    health: 'Focus on digestive health. Clean eating and herbal teas support your wellbeing.',
    luckyNumber: 7,
    luckyColor: 'Navy Blue',
    mood: 'Focused',
  },
  'Libra': {
    general: 'Harmony and balance are within reach today. Relationships flourish through diplomatic communication. Beauty in all forms brings joy.',
    love: 'Partnership energy is strong. Compromise comes easily today. Singles may meet someone refined.',
    career: 'Collaborative projects succeed. Your fair-minded approach resolves disputes effectively.',
    health: 'Balance work and rest. Artistic activities like painting or music therapy soothe your soul.',
    luckyNumber: 3,
    luckyColor: 'Pink',
    mood: 'Harmonious',
  },
  'Scorpio': {
    general: 'Deep transformation is possible today. Trust the process of change. Your intensity attracts powerful opportunities.',
    love: 'Passionate connections intensify. Vulnerability creates deeper intimacy. Trust your partner.',
    career: 'Research and investigation yield valuable insights. Uncover hidden opportunities.',
    health: 'Detoxification practices benefit you. Release what no longer serves your highest good.',
    luckyNumber: 8,
    luckyColor: 'Maroon',
    mood: 'Intense',
  },
  'Sagittarius': {
    general: 'Adventure calls your name today. Expand your horizons through learning or travel. Optimism attracts good fortune.',
    love: 'Shared adventures strengthen relationships. Plan future trips with your partner.',
    career: 'International opportunities or higher education matters progress favorably.',
    health: 'Outdoor activities boost your spirits. Long walks or hiking bring joy and vitality.',
    luckyNumber: 4,
    luckyColor: 'Purple',
    mood: 'Adventurous',
  },
  'Capricorn': {
    general: 'Ambitious goals are within reach today. Your disciplined approach pays off. Career matters take priority.',
    love: 'Stable, committed relationships bring comfort. Show appreciation for your partner\'s support.',
    career: 'Major career advancements are possible. Your hard work and dedication are recognized.',
    health: 'Strengthen your bones and joints. Gentle stretching and calcium-rich foods are beneficial.',
    luckyNumber: 10,
    luckyColor: 'Brown',
    mood: 'Determined',
  },
  'Aquarius': {
    general: 'Innovation and originality mark your day. Unique ideas attract attention. Embrace your individuality.',
    love: 'Intellectual connections deepen. Share your vision with like-minded souls.',
    career: 'Technology and humanitarian projects flourish. Your progressive ideas inspire change.',
    health: 'Circulation and nervous system need attention. Meditation calms an active mind.',
    luckyNumber: 11,
    luckyColor: 'Electric Blue',
    mood: 'Innovative',
  },
  'Pisces': {
    general: 'Spiritual insights flow freely today. Trust your dreams and intuition. Creative projects bring fulfillment.',
    love: 'Soul connections are highlighted. Express love through poetry, art, or music.',
    career: 'Artistic and healing professions are favored. Your compassion helps others.',
    health: 'Foot care is important. Meditation near water brings profound peace.',
    luckyNumber: 12,
    luckyColor: 'Sea Green',
    mood: 'Dreamy',
  },
};

const DailyHoroscope = () => {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const selectedHoroscope = selectedSign ? horoscopeData[selectedSign] : null;
  const selectedZodiac = zodiacSigns.find(z => z.name === selectedSign);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <StarField />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
              <Sun className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Daily Horoscope</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Today's Cosmic Guidance
            </h1>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              {today}
            </p>
          </div>
          
          {/* Zodiac Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-12 max-w-4xl mx-auto">
            {zodiacSigns.map((sign) => (
              <button
                key={sign.name}
                onClick={() => setSelectedSign(sign.name)}
                className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  selectedSign === sign.name
                    ? 'bg-accent/20 border-accent text-accent'
                    : 'bg-card border-border/50 text-foreground hover:border-accent/50'
                }`}
              >
                <span className="text-3xl block mb-2">{sign.symbol}</span>
                <span className="text-sm font-medium">{sign.name}</span>
                <span className="text-xs text-muted-foreground block">{sign.hindi}</span>
              </button>
            ))}
          </div>
          
          {/* Horoscope Display */}
          {selectedHoroscope && selectedZodiac && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
              <Card className="bg-card border-border/50 mb-6">
                <CardHeader className="text-center border-b border-border/50">
                  <div className="text-5xl mb-4">{selectedZodiac.symbol}</div>
                  <CardTitle className="font-serif text-2xl">{selectedZodiac.name}</CardTitle>
                  <CardDescription>
                    {selectedZodiac.hindi} • {selectedZodiac.dates} • {selectedZodiac.element} Element
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap justify-center gap-3 mb-6">
                    <Badge variant="outline" className="gap-1">
                      <Sparkles className="w-3 h-3" />
                      Lucky Number: {selectedHoroscope.luckyNumber}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ background: selectedHoroscope.luckyColor.toLowerCase() }} />
                      Lucky Color: {selectedHoroscope.luckyColor}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Mood: {selectedHoroscope.mood}
                    </Badge>
                  </div>
                  
                  <p className="text-foreground text-center text-lg leading-relaxed mb-6">
                    {selectedHoroscope.general}
                  </p>
                </CardContent>
              </Card>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-card border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-serif text-lg flex items-center gap-2">
                      <Heart className="w-5 h-5 text-destructive" />
                      Love & Relationships
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{selectedHoroscope.love}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-serif text-lg flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      Career & Finance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{selectedHoroscope.career}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-serif text-lg flex items-center gap-2">
                      <Star className="w-5 h-5 text-accent" />
                      Health & Wellness
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{selectedHoroscope.health}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {!selectedSign && (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-accent/30 mx-auto mb-4 animate-pulse-glow" />
              <p className="text-muted-foreground text-lg">
                Select your zodiac sign above to see today's horoscope
              </p>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default DailyHoroscope;