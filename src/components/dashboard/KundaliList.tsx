import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Kundali } from '@/types/database';
import { Star, Calendar, MapPin, Trash2, Eye, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface KundaliListProps {
  kundalis: Kundali[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<boolean>;
}

const KundaliList = ({ kundalis, isLoading, onDelete }: KundaliListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <Star className="w-5 h-5 text-accent" />
            Your Kundalis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse h-24 bg-muted rounded-lg"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-serif flex items-center gap-2">
          <Star className="w-5 h-5 text-accent" />
          Your Kundalis
        </CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link to="/kundali">
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {kundalis.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              You haven't created any kundalis yet
            </p>
            <Button asChild variant="hero">
              <Link to="/kundali">Create Your First Kundali</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {kundalis.map((kundali) => (
              <div
                key={kundali.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-background rounded-lg border border-border/50 gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">
                      {kundali.name}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {kundali.rashi || kundali.gender}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(kundali.date_of_birth), 'dd MMM yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {kundali.place_of_birth}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                  >
                    <Link to={`/kundali/result?id=${kundali.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Kundali</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{kundali.name}"? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(kundali.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deletingId === kundali.id ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KundaliList;
