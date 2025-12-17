import { createLazyFileRoute } from '@tanstack/react-router';
import { useAuth } from '../../hooks/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import TripDetail from '@/components/TripDetail';
import getTripFinanceHistory from '@/api/trip/getTripFinanceHistory';
import { Badge } from '@/components/ui/badge';
import { Users, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const Route = createLazyFileRoute('/trip/finance-history')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTrip, setActiveTrip] = useState(null);

  const fetchHistory = async () => {
    if (!user?.tk) return;
    try {
      setIsLoading(true);
      const data = await getTripFinanceHistory(user.tk);
      setTrips(data);
    } catch (error) {
      router.navigate({
        to: '/error',
        replace: true,
        search: {
          status: error.status || 500,
          msg: error.message || 'An unexpected error occurred.',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user?.tk]);

  return (
    <div className="mx-6 mt-5 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Trip History</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-transparent hover:bg-transparent border-b border-gray-100">
                <TableHead className="w-[30%] py-4 pl-6 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Title
                </TableHead>
                <TableHead className="w-[20%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Destination
                </TableHead>
                <TableHead className="w-[20%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Dates
                </TableHead>
                <TableHead className="w-[15%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Cost
                </TableHead>
                <TableHead className="w-[15%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : (
                trips?.map((trip) => (
                  <TableRow
                    key={trip.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setActiveTrip(trip.id)}
                  >
                    <TableCell className="py-4 pl-6 font-medium text-gray-900">
                      {trip.title}
                    </TableCell>
                    <TableCell className="py-4 text-gray-600">{trip.destination}</TableCell>
                    <TableCell className="py-4 text-gray-600 text-sm">
                      {format(new Date(trip.startDate), 'dd MMM yyyy')} -{' '}
                      {format(new Date(trip.endDate), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell className="py-4 font-medium">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      }).format(trip.cost)}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-600 hover:bg-gray-200 font-normal rounded-full px-3"
                      >
                        {trip.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!isLoading && (!trips || trips.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                    No history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!activeTrip} onOpenChange={(open) => !open && setActiveTrip(null)}>
        <SheetContent className="sm:max-w-xl w-full flex flex-col h-full">
          <SheetHeader className="mb-4">
            <SheetTitle>Trip Details</SheetTitle>
            <SheetDescription>View past trip details.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {activeTrip ? (
              <TripDetail tripId={activeTrip} onClose={() => setActiveTrip(null)} readOnly={true} />
            ) : (
              <p className="p-4 text-center text-muted-foreground">
                Please select an item to view details.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
