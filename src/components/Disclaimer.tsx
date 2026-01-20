import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DisclaimerProps {
    title?: string;
    className?: string;
    type?: 'astrology' | 'data' | 'general' | 'simulation';
}

export const Disclaimer = ({ title = "Important Disclaimer", className = "", type = 'general' }: DisclaimerProps) => {
    const getContent = () => {
        switch (type) {
            case 'astrology':
                return "Astrology is a belief-based system for guidance and spiritual insight. Predictions are interpretative and should not be considered as absolute facts or as a substitute for professional medical, legal, or financial advice.";
            case 'data':
                return "Your privacy is our priority. Birth details collected are strictly used for generating astrological charts and insights. We do not store, sell, or share your personal data with third parties.";
            case 'simulation':
                return "This feature provides a simulated result for demonstration purposes. For genuine Vedic compatibility analysis, please consult a certified Astrologer.";
            default:
                return "The insights provided on this platform are for entertainment and spiritual guidance purposes. Outcomes may vary, and user discretion is advised.";
        }
    };

    return (
        <Alert className={`bg-accent/5 border-accent/20 text-muted-foreground ${className}`}>
            <AlertCircle className="h-4 w-4 text-accent" />
            <AlertTitle className="text-foreground font-serif tracking-wide">{title}</AlertTitle>
            <AlertDescription className="text-sm leading-relaxed mt-2">
                {getContent()}
            </AlertDescription>
        </Alert>
    );
};
