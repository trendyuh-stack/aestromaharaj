import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StarField } from '@/components/StarField';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
                <StarField />
                <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Privacy Policy</h1>

                    <div className="space-y-8 text-muted-foreground bg-card p-8 rounded-lg border border-border/50">
                        <div>
                            <h2 className="text-xl font-serif text-foreground mb-3">1. Information We Collect</h2>
                            <p>We collect only the essential information required to generate astrological insights, specifically:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Name (for personalization)</li>
                                <li>Date of Birth</li>
                                <li>Time of Birth</li>
                                <li>Place of Birth</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-serif text-foreground mb-3">2. How We Use Your Information</h2>
                            <p>Your birth data is used exclusively for:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Calculating planetary positions (Kundali)</li>
                                <li>Generating compatibility reports</li>
                                <li>Providing astrological guidance</li>
                            </ul>
                            <p className="mt-2">We do <strong>not</strong> sell, rent, or share your personal data with any third parties / advertisers.</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-serif text-foreground mb-3">3. Data Storage & Security</h2>
                            <p>We employ industry-standard encryption protocols to protect your data during transmission. We do not permanently store sensitive birth charts unless you create a user account, in which case it is secured with standard authentication measures.</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-serif text-foreground mb-3">4. Cookies</h2>
                            <p>We use minimal cookies strictly for site functionality (e.g., keeping you logged in) and to improve user experience. You can manage cookie preferences through your browser settings.</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-serif text-foreground mb-3">5. Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy, please contact us via our Contact page.</p>
                        </div>

                        <p className="text-sm italic pt-4 border-t border-border/50">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
