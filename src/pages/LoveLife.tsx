import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Stars, Sparkles, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface RelationshipData {
    name1: string;
    name2: string;
    status: 'single' | 'dating' | 'married' | 'complicated';
}

const LoveLife = () => {
    const [formData, setFormData] = useState<RelationshipData>({
        name1: '',
        name2: '',
        status: 'single'
    });

    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const calculateCompatibility = () => {
        // Deterministic simulation based on names
        const s1 = formData.name1.toLowerCase().trim();
        const s2 = formData.name2.toLowerCase().trim();

        // Simple hash for demo
        let hash = 0;
        for (let i = 0; i < s1.length; i++) hash += s1.charCodeAt(i);
        for (let i = 0; i < s2.length; i++) hash += s2.charCodeAt(i);

        // Mix with simulated complexity
        const loveScore = Math.abs(hash % 41) + 60; // Always between 60-100 for positivity
        const trustScore = Math.abs((hash * 13) % 51) + 50;

        const compatibility = {
            score: loveScore,
            trust: trustScore,
            text: loveScore > 90 ? "A match made in heaven! Your cosmic alignment indicates deep spiritual bonding."
                : loveScore > 80 ? "Your energies are highly compatible. Passion and understanding flow naturally."
                    : "A strong potential connection. With patience and communication, this bond can flourish.",
            guidance: "Mars and Venus suggest energy exchanges. Focus on open communication this week."
        };

        return compatibility;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name1) {
            toast.error("Please enter your name");
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setResult(calculateCompatibility());
            setIsLoading(false);
            toast.success("Analysis Complete!");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full mb-6">
                            <Heart className="w-4 h-4 text-pink-500" />
                            <span className="text-sm font-medium text-pink-600 dark:text-pink-400">Love & Relationships</span>
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                            Cosmic Love Compatibility
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Discover the hidden dynamics of your relationship. Whether you're single, dating, or married, get insights into your romantic future based on name energy vibrations.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <Card className="border-pink-200/20 shadow-lg shadow-pink-500/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Stars className="w-5 h-5 text-pink-500" />
                                    Details
                                </CardTitle>
                                <CardDescription>Enter names to calculate energy resonance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Your Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                placeholder="e.g. Anjali"
                                                className="pl-9"
                                                value={formData.name1}
                                                onChange={(e) => setFormData({ ...formData, name1: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Partner's Name (Optional if Single)</Label>
                                        <div className="relative">
                                            <Heart className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                placeholder="e.g. Rahul"
                                                className="pl-9"
                                                value={formData.name2}
                                                onChange={(e) => setFormData({ ...formData, name2: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Consulting the Stars..." : "Analyze Compatibility"}
                                        {!isLoading && <Sparkles className="ml-2 w-4 h-4" />}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            {result ? (
                                <Card className="border-pink-200/20 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-transparent z-0" />
                                    <CardHeader className="relative z-10">
                                        <CardTitle className="text-2xl font-serif">Your Cosmic Report</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 relative z-10">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm font-medium">
                                                <span>Love Frequency</span>
                                                <span className="text-pink-600">{result.score}%</span>
                                            </div>
                                            <Progress value={result.score} className="h-2 bg-pink-100 [&>div]:bg-pink-500" />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm font-medium">
                                                <span>Emotional Trust</span>
                                                <span className="text-purple-600">{result.trust}%</span>
                                            </div>
                                            <Progress value={result.trust} className="h-2 bg-purple-100 [&>div]:bg-purple-600" />
                                        </div>

                                        <div className="bg-accent/5 p-4 rounded-lg border border-accent/10">
                                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-accent" />
                                                Verdict
                                            </h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {result.text}
                                            </p>
                                        </div>

                                        <div className="bg-pink-50/50 dark:bg-pink-950/20 p-4 rounded-lg border border-pink-100/20">
                                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-pink-600 dark:text-pink-400">
                                                <Heart className="w-4 h-4" />
                                                Guidance
                                            </h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {result.guidance}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="h-full flex items-center justify-center p-8 border border-dashed border-border rounded-xl bg-accent/5 text-center">
                                    <div className="space-y-4 max-w-xs">
                                        <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center mx-auto">
                                            <Heart className="w-6 h-6 text-pink-500" />
                                        </div>
                                        <h3 className="font-semibold text-lg">Relationship Insights</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Enter names to unlock detailed astrological compatibility and guidance for your love life.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LoveLife;
