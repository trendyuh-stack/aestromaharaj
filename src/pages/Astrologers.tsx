import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StarField } from '@/components/StarField';
import { AstrologerCard } from '@/components/AstrologerCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Search, Filter } from 'lucide-react';
import { useAstrologers } from '@/hooks/useAstrologers';

const Astrologers = () => {
  const { astrologers, isLoading } = useAstrologers();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filterExpertise, setFilterExpertise] = useState('all');

  // Get unique expertise categories
  const expertiseCategories = Array.from(
    new Set(astrologers.flatMap((a) => a.expertise))
  ).sort();

  const filteredAstrologers = astrologers
    .filter((astrologer) => {
      const matchesSearch = 
        astrologer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        astrologer.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (astrologer.bio && astrologer.bio.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesExpertise = 
        filterExpertise === 'all' || 
        astrologer.expertise.includes(filterExpertise);
      
      return matchesSearch && matchesExpertise;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'experience') return b.experience_years - a.experience_years;
      if (sortBy === 'price-low') return a.price_per_session - b.price_per_session;
      if (sortBy === 'price-high') return b.price_per_session - a.price_per_session;
      return 0;
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <StarField />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Expert Guidance</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Expert Astrologers
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with verified and experienced astrologers for personalized consultations via live video calls
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card"
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={filterExpertise} onValueChange={setFilterExpertise}>
                <SelectTrigger className="w-[180px] bg-card">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {expertiseCategories.map((expertise) => (
                    <SelectItem key={expertise} value={expertise}>
                      {expertise}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] bg-card">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Results Count */}
          <p className="text-muted-foreground mb-6">
            Showing {filteredAstrologers.length} astrologer{filteredAstrologers.length !== 1 ? 's' : ''}
          </p>
          
          {/* Loading State */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse h-80 bg-card rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {/* Astrologers Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredAstrologers.map((astrologer) => (
                  <AstrologerCard 
                    key={astrologer.id}
                    id={astrologer.id}
                    name={astrologer.name}
                    specialty={astrologer.expertise.slice(0, 2).join(' & ')}
                    experience={astrologer.experience_years}
                    rating={astrologer.rating || 4.5}
                    price={astrologer.price_per_session}
                    imageUrl={astrologer.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'}
                    languages={astrologer.languages}
                    isOnline={true}
                  />
                ))}
              </div>
              
              {filteredAstrologers.length === 0 && (
                <div className="text-center py-16">
                  <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No astrologers found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Astrologers;
