const zodiacSigns = [
  { symbol: '♈', name: 'Aries' },
  { symbol: '♉', name: 'Taurus' },
  { symbol: '♊', name: 'Gemini' },
  { symbol: '♋', name: 'Cancer' },
  { symbol: '♌', name: 'Leo' },
  { symbol: '♍', name: 'Virgo' },
  { symbol: '♎', name: 'Libra' },
  { symbol: '♏', name: 'Scorpio' },
  { symbol: '♐', name: 'Sagittarius' },
  { symbol: '♑', name: 'Capricorn' },
  { symbol: '♒', name: 'Aquarius' },
  { symbol: '♓', name: 'Pisces' },
];

export const ZodiacWheel = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`relative w-80 h-80 md:w-96 md:h-96 ${className}`}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-rotate-slow" />
      
      {/* Middle ring */}
      <div className="absolute inset-6 rounded-full border border-primary/40" />
      
      {/* Inner ring */}
      <div className="absolute inset-12 rounded-full border border-secondary/30" />
      
      {/* Center glow */}
      <div className="absolute inset-24 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 blur-lg" />
      
      {/* Zodiac symbols */}
      {zodiacSigns.map((sign, index) => {
        const angle = (index * 30 - 90) * (Math.PI / 180);
        const radius = 140;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <div
            key={sign.name}
            className="absolute text-accent/70 text-xl md:text-2xl font-serif transition-colors hover:text-accent"
            style={{
              left: `calc(50% + ${x}px - 12px)`,
              top: `calc(50% + ${y}px - 12px)`,
            }}
            title={sign.name}
          >
            {sign.symbol}
          </div>
        );
      })}
      
      {/* Center symbol */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl md:text-5xl text-accent animate-pulse-glow">☉</span>
      </div>
    </div>
  );
};
