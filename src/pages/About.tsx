import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StarField } from '@/components/StarField';
import { Heart, Shield, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <StarField />
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">About Aestro Maharaj</h1>
            <p className="text-lg text-muted-foreground">Bridging Ancient Wisdom with Modern Integrity</p>
          </div>

          <div className="space-y-12">
            {/* Mission */}
            <div className="bg-card p-8 rounded-lg border border-border/50">
              <h2 className="text-2xl font-serif text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe that Vedic Astrology is a profound tool for self-discovery and spiritual navigation. Our mission is to make these ancient insights accessible, understandable, and free from fear-mongering. We strive to provide guidance that empowers you to make informed decisions, rather than predicting a fatalistic future.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border border-border/50">
                <Shield className="h-8 w-8 text-accent mb-4" />
                <h3 className="text-xl font-serif text-foreground mb-2">Authenticity & Privacy</h3>
                <p className="text-muted-foreground">
                  We use Swiss Ephemeris data for high-precision calculations. Your privacy is sacred to us; we never exploit your personal belief for profit or misuse your data.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border/50">
                <Heart className="h-8 w-8 text-accent mb-4" />
                <h3 className="text-xl font-serif text-foreground mb-2">Ethical Guidance</h3>
                <p className="text-muted-foreground">
                  Our practitioners are vetted for their knowledge and ethical standards. We strictly prohibit fear-based predictions and guarantees of "magical" fixes.
                </p>
              </div>
            </div>

            {/* Philosophy */}
            <div className="bg-card p-8 rounded-lg border border-border/50">
              <h2 className="text-2xl font-serif text-foreground mb-4">Our Philosophy</h2>
              <p className="text-muted-foreground leading-relaxed">
                "Astrology is a language. If you understand this language, the sky speaks to you."
                <br /><br />
                We view the horoscope not as a rigid script, but as a map of potentials. Our role is to help you read this map so you can walk your path with confidence and clarity. We honor the tradition of the Rishis while maintaining a rational, modern approach.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
