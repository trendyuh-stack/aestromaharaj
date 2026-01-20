import { Link } from 'react-router-dom';
import { Star, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-accent" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">
                Aestro <span className="text-accent">Maharaj</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Accurate Kundali. Real Astrologers. Trusted Guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground text-sm hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/kundali" className="text-muted-foreground text-sm hover:text-accent transition-colors">
                  Generate Kundali
                </Link>
              </li>
              <li>
                <Link to="/astrologers" className="text-muted-foreground text-sm hover:text-accent transition-colors">
                  Our Astrologers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground text-sm hover:text-accent transition-colors">
                  Book Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-foreground">Services</h4>
            <ul className="space-y-2">
              <li><Link to="/kundali" className="text-muted-foreground text-sm hover:text-accent">Kundali Generation</Link></li>
              <li><Link to="/horoscope" className="text-muted-foreground text-sm hover:text-accent">Horoscope Reading</Link></li>
              <li><Link to="/match-making" className="text-muted-foreground text-sm hover:text-accent">Match Making</Link></li>
              <li><Link to="/numerology" className="text-muted-foreground text-sm hover:text-accent">Numerology</Link></li>
              <li><Link to="/love-compatibility" className="text-muted-foreground text-sm hover:text-accent">Love Compatibility</Link></li>
              <li><Link to="/tarot" className="text-muted-foreground text-sm hover:text-accent">Tarot Reading</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-foreground">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-accent" />
                info.trendyuh@gmail.com
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-accent" />
                +91 79994 68835
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-accent mt-0.5" />
                Mumbai, Maharashtra, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Aestro Maharaj. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-muted-foreground text-sm hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" className="text-muted-foreground text-sm hover:text-accent transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
