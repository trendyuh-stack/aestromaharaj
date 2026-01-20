import { Button } from '@/components/ui/button';
import { Star, Clock, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AstrologerCardProps {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  price: number;
  imageUrl: string;
  languages: string[];
  isOnline?: boolean;
}

export const AstrologerCard = ({
  id,
  name,
  specialty,
  experience,
  rating,
  price,
  imageUrl,
  languages,
  isOnline = false,
}: AstrologerCardProps) => {
  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-accent/30 transition-all duration-300 hover:shadow-lg group">
      {/* Image Section */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Online Status */}
        {isOnline && (
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-500/30">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-400">Online</span>
          </div>
        )}
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="text-sm font-medium text-foreground">{rating}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 md:p-6">
        <h3 className="font-serif text-xl font-semibold text-foreground mb-1">{name}</h3>
        <p className="text-accent text-sm font-medium mb-3">{specialty}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            {experience}+ years
          </span>
          {languages.slice(0, 2).map((lang) => (
            <span key={lang} className="text-xs text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-full">
              {lang}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div>
            <span className="text-xs text-muted-foreground">Starting from</span>
            <p className="text-lg font-semibold text-accent">₹{price}<span className="text-sm text-muted-foreground">/session</span></p>
          </div>
          <Link to={`/booking/${id}`}>
            <Button variant="cosmic" size="sm" className="gap-2">
              <Video className="w-4 h-4" />
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
