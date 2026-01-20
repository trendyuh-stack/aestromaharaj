import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StarField } from '@/components/StarField';
import { ZodiacWheel } from '@/components/ZodiacWheel';
import { FeatureCard } from '@/components/FeatureCard';
import { AstrologerCard } from '@/components/AstrologerCard';
import { TestimonialCard } from '@/components/TestimonialCard';
import {
  Star,
  Moon,
  Sun,
  Users,
  Shield,
  Clock,
  Video,
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const features = [
  {
    icon: Sun,
    title: 'Precise Calculations',
    description: 'Utilizing Swiss Ephemeris data for mathematically accurate planetary positioning and charts.',
  },
  {
    icon: Users,
    title: 'Verified Practitioners',
    description: 'Consult with certified Acharyas and Shastris who have demonstrated deep Vedic knowledge.',
  },
  {
    icon: Video,
    title: 'Secure Consultations',
    description: 'Private 1-on-1 sessions on a secure platform, respecting the sanctity of the guidance provided.',
  },
  {
    icon: Shield,
    title: 'Confidentiality Guaranteed',
    description: 'Your birth details and personal questions are treated with the highest level of privacy.',
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Interpretation',
    description: 'Receiving detailed analysis covering Dasha systems, planetary yogas, and remedial measures.',
  },
  {
    icon: Clock,
    title: 'Timely Guidance',
    description: 'Understanding the importance of muhurata and timing in Vedic astrology.',
  },
];

const sampleAstrologers = [
  {
    id: '1',
    name: 'Acharya Rajeshwar',
    specialty: 'Vedic Astrology & Vastu Shastra',
    experience: 28,
    rating: 4.9,
    price: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    languages: ['Hindi', 'Sanskrit', 'English'],
    isOnline: true,
  },
  {
    id: '2',
    name: 'Dr. Priya Sharma (PhD)',
    specialty: 'Career & Relationship Counseling',
    experience: 18,
    rating: 4.9,
    price: 900,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    languages: ['Hindi', 'English', 'Marathi'],
    isOnline: true,
  },
  {
    id: '3',
    name: 'Shastri Vikram Nath',
    specialty: 'Gemology & Remedial Measures',
    experience: 22,
    rating: 4.8,
    price: 750,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    languages: ['Hindi', 'Gujarati'],
    isOnline: false,
  },
];

const testimonials = [
  {
    name: 'Vikram Malhotra',
    location: 'Mumbai',
    rating: 5,
    testimonial: 'The depth of analysis provided for my business query was exceptional. It wasn\'t just predictions, but strategic guidance based on planetary periods.',
  },
  {
    name: 'Sarah Jenkins',
    location: 'London (UK)',
    rating: 5,
    testimonial: 'I was skeptical at first, but the clarity regarding my personal life was astounding. Highly professional approach without any fear-mongering.',
  },
  {
    name: 'Arun Patel',
    location: 'Ahmedabad',
    rating: 5,
    testimonial: 'Authentic calculation and very sensible advice. Acharya ji explained the remediation clearly. A trustworthy platform for serious seekers.',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-background/70" />
        </div>

        <StarField />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Trusted by Seekers Worldwide</span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Ancient Vedic Wisdom for{' '}
                <span className="text-accent">Modern Life</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Precision-based Kundali analysis and authentic guidance from learned Acharyas.
                Navigate your life's path with clarity and purpose.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/kundali">
                  <Button variant="hero" size="xl" className="gap-2 w-full sm:w-auto">
                    Generate Free Kundali
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/astrologers">
                  <Button variant="spiritual" size="xl" className="gap-2 w-full sm:w-auto">
                    <Video className="w-5 h-5" />
                    Talk to Astrologer
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-10 justify-center lg:justify-start">
                {['Swiss Ephemeris Accuracy', 'Certified Practitioners', 'Privacy Assured'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Zodiac Wheel */}
            <div className="hidden lg:flex justify-center">
              <ZodiacWheel className="animate-float" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-accent/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-accent rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-4">
              <Moon className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Why Choose Us</span>
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Path to Clarity
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine the precision of calculations with the wisdom of tradition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Astrologers Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-4">
                <Star className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Expert Guidance</span>
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet Our Astrologers
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Connect with experienced and verified astrologers for personalized consultations
              </p>
            </div>
            <Link to="/astrologers" className="mt-4 md:mt-0">
              <Button variant="gold" className="gap-2">
                View All Astrologers
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sampleAstrologers.map((astrologer) => (
              <AstrologerCard key={astrologer.id} {...astrologer} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-4">
              <Users className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Testimonials</span>
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Stories of Transformation
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real experiences from individuals who found direction and peace.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <StarField />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Begin Your Journey to Self-Discovery
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Receive your detailed life chart and insights today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/kundali">
                <Button variant="hero" size="xl" className="gap-2 w-full sm:w-auto">
                  Generate Free Kundali
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
