import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StarField } from '@/components/StarField';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const Contact = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
                <StarField />
                <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                    <div className="text-center mb-12">
                        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Contact Us</h1>
                        <p className="text-muted-foreground">We are here to help and listen.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-card p-6 rounded-lg border border-border/50">
                                <h2 className="text-xl font-serif text-foreground mb-6">Get in Touch</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <Mail className="h-5 w-5 text-accent mt-1" />
                                        <div>
                                            <p className="font-medium text-foreground">Email</p>
                                            <p className="text-muted-foreground">info.trendyuh@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Phone className="h-5 w-5 text-accent mt-1" />
                                        <div>
                                            <p className="font-medium text-foreground">Phone</p>
                                            <p className="text-muted-foreground">+91 79994 68835</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <MapPin className="h-5 w-5 text-accent mt-1" />
                                        <div>
                                            <p className="font-medium text-foreground">Office</p>
                                            <p className="text-muted-foreground">
                                                Bengaluru, Karnataka<br />
                                                India
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-accent/5 p-6 rounded-lg border border-accent/20">
                                <p className="text-sm text-foreground italic">
                                    "For queries related to consultations, please verify your booking ID in the subject line for faster support."
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-card p-8 rounded-lg border border-border/50">
                            <h2 className="text-xl font-serif text-foreground mb-6">Send a Message</h2>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Your name" className="bg-background" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="your@email.com" className="bg-background" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" placeholder="How can we assist you?" className="bg-background min-h-[120px]" />
                                </div>
                                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Contact;
