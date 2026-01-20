import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StarField } from '@/components/StarField';

const TermsOfUse = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
                <StarField />
                <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Terms of Use</h1>

                    <div className="space-y-8 text-muted-foreground bg-card p-8 rounded-lg border border-border/50">
                        <div>
                            <h2 className="text-xl font-serif text-foreground mb-3">1. Acceptance of Terms</h2>
                            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-serif text-foreground mb-3">2. Nature of Services</h2>
                            <p>Our services, including charts, predictions, and consultations, are for spiritual guidance and entertainment purposes only. Astrology is interpretative, and we make no claims or guarantees regarding the accuracy of predictions or specific outcomes.</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-serif text-foreground mb-3">3. No Professional Advice</h2>
                            <p>Content on this site should not be substituted for professional advice from legal, medical, or financial professionals. Decisions made based on our content are at your own discretion and risk.</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-serif text-foreground mb-3">4. User Conduct</h2>
                            <p>You agree to use the website only for lawful purposes. You must not use the site in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-serif text-foreground mb-3">5. Intellectual Property</h2>
                            <p>All content included on the site, such as text, graphics, logos, images, and software, is the property of Aestro Maharaj or its content suppliers and protected by international copyright laws.</p>
                        </div>

                        <p className="text-sm italic pt-4 border-t border-border/50">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default TermsOfUse;
