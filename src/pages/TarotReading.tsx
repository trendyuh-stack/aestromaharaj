import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StarField } from '@/components/StarField';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RotateCcw, Eye, Heart, Briefcase, Star, Moon } from 'lucide-react';
import { Disclaimer } from '@/components/Disclaimer';

interface TarotCard {
  name: string;
  arcana: 'Major' | 'Minor';
  suit?: string;
  meaning: string;
  reversed: string;
  keywords: string[];
  element?: string;
}

const majorArcana: TarotCard[] = [
  { name: 'The Fool', arcana: 'Major', meaning: 'New beginnings, innocence, spontaneity, and a free spirit. Trust the journey ahead.', reversed: 'Recklessness, risk-taking, holding back from taking a leap of faith.', keywords: ['Beginnings', 'Innocence', 'Spontaneity', 'Adventure'], element: 'Air' },
  { name: 'The Magician', arcana: 'Major', meaning: 'Manifestation, resourcefulness, power, and inspired action. You have all the tools you need.', reversed: 'Manipulation, poor planning, untapped talents.', keywords: ['Willpower', 'Skill', 'Concentration', 'Creation'], element: 'Air' },
  { name: 'The High Priestess', arcana: 'Major', meaning: 'Intuition, sacred knowledge, divine feminine, and the subconscious mind.', reversed: 'Secrets being kept, disconnected from intuition, withdrawal.', keywords: ['Intuition', 'Mystery', 'Wisdom', 'Patience'], element: 'Water' },
  { name: 'The Empress', arcana: 'Major', meaning: 'Femininity, beauty, nature, nurturing, and abundance in all forms.', reversed: 'Creative block, dependence on others, neglecting self-care.', keywords: ['Fertility', 'Nurturing', 'Nature', 'Abundance'], element: 'Earth' },
  { name: 'The Emperor', arcana: 'Major', meaning: 'Authority, establishment, structure, and a father figure. Leadership and control.', reversed: 'Tyranny, rigidity, domination, lack of discipline.', keywords: ['Authority', 'Structure', 'Control', 'Leadership'], element: 'Fire' },
  { name: 'The Hierophant', arcana: 'Major', meaning: 'Spiritual wisdom, religious beliefs, conformity, tradition, and institutions.', reversed: 'Personal beliefs, freedom, challenging the status quo.', keywords: ['Tradition', 'Conformity', 'Teaching', 'Beliefs'], element: 'Earth' },
  { name: 'The Lovers', arcana: 'Major', meaning: 'Love, harmony, relationships, values alignment, and choices of the heart.', reversed: 'Disharmony, imbalance, misalignment of values.', keywords: ['Love', 'Union', 'Partnership', 'Choices'], element: 'Air' },
  { name: 'The Chariot', arcana: 'Major', meaning: 'Control, willpower, success, action, and determination to overcome obstacles.', reversed: 'Lack of control, opposition, aggression, no direction.', keywords: ['Determination', 'Victory', 'Willpower', 'Control'], element: 'Water' },
  { name: 'Strength', arcana: 'Major', meaning: 'Strength, courage, persuasion, influence, and compassion in action.', reversed: 'Self-doubt, weakness, insecurity, raw emotion.', keywords: ['Courage', 'Patience', 'Influence', 'Compassion'], element: 'Fire' },
  { name: 'The Hermit', arcana: 'Major', meaning: 'Soul-searching, introspection, being alone, inner guidance, and wisdom.', reversed: 'Isolation, loneliness, withdrawal from society.', keywords: ['Solitude', 'Wisdom', 'Guidance', 'Introspection'], element: 'Earth' },
  { name: 'Wheel of Fortune', arcana: 'Major', meaning: 'Good luck, karma, life cycles, destiny, and turning points in life.', reversed: 'Bad luck, resistance to change, breaking cycles.', keywords: ['Fate', 'Destiny', 'Cycles', 'Change'], element: 'Fire' },
  { name: 'Justice', arcana: 'Major', meaning: 'Justice, fairness, truth, cause and effect, and legal matters.', reversed: 'Unfairness, lack of accountability, dishonesty.', keywords: ['Fairness', 'Truth', 'Law', 'Balance'], element: 'Air' },
  { name: 'The Hanged Man', arcana: 'Major', meaning: 'Pause, surrender, letting go, new perspectives, and sacrifice.', reversed: 'Delays, resistance, stalling, indecision.', keywords: ['Sacrifice', 'Release', 'Perspective', 'Waiting'], element: 'Water' },
  { name: 'Death', arcana: 'Major', meaning: 'Endings, change, transformation, and transition. A powerful metamorphosis.', reversed: 'Resistance to change, personal transformation delayed.', keywords: ['Endings', 'Change', 'Transformation', 'Transition'], element: 'Water' },
  { name: 'Temperance', arcana: 'Major', meaning: 'Balance, moderation, patience, and purpose. Finding middle ground.', reversed: 'Imbalance, excess, self-healing, re-alignment.', keywords: ['Balance', 'Patience', 'Moderation', 'Purpose'], element: 'Fire' },
  { name: 'The Devil', arcana: 'Major', meaning: 'Shadow self, attachment, addiction, restriction, and sexuality.', reversed: 'Releasing limiting beliefs, exploring dark thoughts, detachment.', keywords: ['Bondage', 'Materialism', 'Addiction', 'Shadow'], element: 'Earth' },
  { name: 'The Tower', arcana: 'Major', meaning: 'Sudden change, upheaval, chaos, revelation, and awakening.', reversed: 'Personal transformation, fear of change, averting disaster.', keywords: ['Upheaval', 'Revelation', 'Awakening', 'Change'], element: 'Fire' },
  { name: 'The Star', arcana: 'Major', meaning: 'Hope, faith, purpose, renewal, and spirituality. A beautiful omen.', reversed: 'Lack of faith, despair, self-trust issues, disconnection.', keywords: ['Hope', 'Faith', 'Renewal', 'Serenity'], element: 'Air' },
  { name: 'The Moon', arcana: 'Major', meaning: 'Illusion, fear, anxiety, subconscious, and intuition in the darkness.', reversed: 'Release of fear, repressed emotion, inner confusion.', keywords: ['Illusion', 'Fear', 'Intuition', 'Subconscious'], element: 'Water' },
  { name: 'The Sun', arcana: 'Major', meaning: 'Positivity, fun, warmth, success, and vitality. Joy and celebration!', reversed: 'Inner child issues, feeling down, overly optimistic.', keywords: ['Joy', 'Success', 'Vitality', 'Positivity'], element: 'Fire' },
  { name: 'Judgement', arcana: 'Major', meaning: 'Judgement, rebirth, inner calling, and absolution. A spiritual awakening.', reversed: 'Self-doubt, inner critic, ignoring the call.', keywords: ['Rebirth', 'Calling', 'Absolution', 'Reflection'], element: 'Fire' },
  { name: 'The World', arcana: 'Major', meaning: 'Completion, integration, accomplishment, and travel. Full circle.', reversed: 'Seeking personal closure, short-cuts, incomplete.', keywords: ['Completion', 'Achievement', 'Fulfillment', 'Wholeness'], element: 'Earth' },
];

const TarotReading = () => {
  const [isReading, setIsReading] = useState(false);
  const [selectedCards, setSelectedCards] = useState<{ card: TarotCard; position: string; isReversed: boolean }[]>([]);
  const [showCards, setShowCards] = useState(false);
  const [readingType, setReadingType] = useState<'single' | 'three' | null>(null);

  const positions = {
    single: ['Present Situation'],
    three: ['Past', 'Present', 'Future'],
  };

  const drawCards = (type: 'single' | 'three') => {
    setReadingType(type);
    setIsReading(true);
    setShowCards(false);

    const count = type === 'single' ? 1 : 3;
    const shuffled = [...majorArcana].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, count).map((card, idx) => ({
      card,
      position: positions[type][idx],
      isReversed: Math.random() > 0.7,
    }));

    setTimeout(() => {
      setSelectedCards(drawn);
      setShowCards(true);
      setIsReading(false);
    }, 2000);
  };

  const resetReading = () => {
    setSelectedCards([]);
    setShowCards(false);
    setReadingType(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <StarField />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
              <Eye className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Tarot Reading</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Divine Tarot Guidance
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Let the cards reveal hidden truths and guide you on your spiritual journey
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <Disclaimer type="astrology" />
          </div>

          {!readingType ? (
            <div className="max-w-2xl mx-auto">
              <Card className="bg-card border-border/50 mb-8">
                <CardHeader className="text-center">
                  <CardTitle className="font-serif text-2xl">Choose Your Reading</CardTitle>
                  <CardDescription>Select the type of tarot reading you'd like to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <button
                    onClick={() => drawCards('single')}
                    className="w-full p-6 bg-background rounded-xl border border-border/50 hover:border-accent/50 transition-all duration-300 text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                        <Star className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-semibold mb-1">Single Card Reading</h3>
                        <p className="text-muted-foreground text-sm">
                          A quick insight into your current situation. Perfect for daily guidance or a simple yes/no question.
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => drawCards('three')}
                    className="w-full p-6 bg-background rounded-xl border border-border/50 hover:border-accent/50 transition-all duration-300 text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                        <Moon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-semibold mb-1">Past-Present-Future</h3>
                        <p className="text-muted-foreground text-sm">
                          A three-card spread revealing the influences of your past, your current situation, and what lies ahead.
                        </p>
                      </div>
                    </div>
                  </button>
                </CardContent>
              </Card>

              <p className="text-center text-sm text-muted-foreground">
                Focus on your question, take a deep breath, and let the cards speak to you 🔮
              </p>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              {isReading && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/20 mb-6 animate-pulse">
                    <Sparkles className="w-12 h-12 text-accent animate-spin" />
                  </div>
                  <p className="text-xl font-serif text-foreground mb-2">Shuffling the cards...</p>
                  <p className="text-muted-foreground">Focus on your question</p>
                </div>
              )}

              {showCards && (
                <div className="animate-in fade-in duration-700">
                  <div className={`grid gap-6 mb-8 ${selectedCards.length === 1 ? 'max-w-md mx-auto' : 'md:grid-cols-3'}`}>
                    {selectedCards.map(({ card, position, isReversed }, idx) => (
                      <Card
                        key={idx}
                        className={`bg-card border-accent/30 transition-all duration-500 ${isReversed ? 'rotate-180' : ''}`}
                        style={{ animationDelay: `${idx * 200}ms` }}
                      >
                        <CardHeader className={`text-center border-b border-border/50 ${isReversed ? 'rotate-180' : ''}`}>
                          <Badge variant="outline" className="mx-auto mb-2">{position}</Badge>
                          <CardTitle className="font-serif text-xl">
                            {card.name}
                            {isReversed && <span className="text-destructive ml-2">(Reversed)</span>}
                          </CardTitle>
                          <CardDescription>{card.arcana} Arcana • {card.element}</CardDescription>
                        </CardHeader>
                        <CardContent className={`pt-6 ${isReversed ? 'rotate-180' : ''}`}>
                          <div className="text-6xl text-center mb-4">
                            {card.name === 'The Fool' && '🃏'}
                            {card.name === 'The Magician' && '✨'}
                            {card.name === 'The High Priestess' && '🌙'}
                            {card.name === 'The Empress' && '👑'}
                            {card.name === 'The Emperor' && '⚔️'}
                            {card.name === 'The Hierophant' && '🔱'}
                            {card.name === 'The Lovers' && '❤️'}
                            {card.name === 'The Chariot' && '🏆'}
                            {card.name === 'Strength' && '🦁'}
                            {card.name === 'The Hermit' && '🏔️'}
                            {card.name === 'Wheel of Fortune' && '🎡'}
                            {card.name === 'Justice' && '⚖️'}
                            {card.name === 'The Hanged Man' && '🙃'}
                            {card.name === 'Death' && '🦋'}
                            {card.name === 'Temperance' && '⚗️'}
                            {card.name === 'The Devil' && '⛓️'}
                            {card.name === 'The Tower' && '🗼'}
                            {card.name === 'The Star' && '⭐'}
                            {card.name === 'The Moon' && '🌕'}
                            {card.name === 'The Sun' && '☀️'}
                            {card.name === 'Judgement' && '📯'}
                            {card.name === 'The World' && '🌍'}
                          </div>
                          <p className="text-foreground leading-relaxed mb-4">
                            {isReversed ? card.reversed : card.meaning}
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {card.keywords.map((keyword) => (
                              <Badge key={keyword} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-card border-accent/30 mb-8">
                    <CardHeader>
                      <CardTitle className="font-serif flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-accent" />
                        Reading Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedCards.length === 1 ? (
                          `The ${selectedCards[0].card.name}${selectedCards[0].isReversed ? ' (Reversed)' : ''} speaks to your current moment. ${selectedCards[0].isReversed ? selectedCards[0].card.reversed : selectedCards[0].card.meaning} Take time to reflect on how this energy manifests in your life right now.`
                        ) : (
                          `Your journey shows the influence of ${selectedCards[0].card.name} in your past, the energy of ${selectedCards[1].card.name} shaping your present, and ${selectedCards[2].card.name} guiding your future. Together, these cards weave a story of transformation and growth.`
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="text-center">
                    <Button variant="outline" size="lg" onClick={resetReading} className="gap-2">
                      <RotateCcw className="w-4 h-4" />
                      New Reading
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TarotReading;