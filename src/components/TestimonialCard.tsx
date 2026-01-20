import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  testimonial: string;
  avatarUrl?: string;
}

export const TestimonialCard = ({
  name,
  location,
  rating,
  testimonial,
  avatarUrl,
}: TestimonialCardProps) => {
  return (
    <div className="bg-card p-6 md:p-8 rounded-2xl border border-border/50 relative">
      {/* Quote Icon */}
      <Quote className="absolute top-6 right-6 w-10 h-10 text-accent/20" />
      
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-accent fill-accent' : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
      
      {/* Testimonial */}
      <p className="text-foreground leading-relaxed mb-6 italic">"{testimonial}"</p>
      
      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-accent font-serif text-lg">{name.charAt(0)}</span>
          )}
        </div>
        <div>
          <p className="font-medium text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
      </div>
    </div>
  );
};
