import { createLazyFileRoute, Link } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import TripDetail from '@/components/TripDetail';
import { format } from 'date-fns';

import { useAuth } from '@/hooks/AuthContext';
import getTripManager from '@/api/trip/getTripManager';
import { router } from '@/router';

export const Route = createLazyFileRoute('/trip/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTripId, setActiveTripId] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user?.tk) return;
      try {
        const data = await getTripManager(user.tk);

        // Transform data for table display
        const formattedData = data.map((trip) => ({
          ...trip,
          dates: `${format(new Date(trip.startDate), 'dd MMM')} - ${format(new Date(trip.endDate), 'dd MMM yyyy')}`,
          participants: trip.participants ? trip.participants.length : 0,
        }));

        setTrips(formattedData);
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
        setLoading(false);
      }
    };
    fetchTrips();
  }, [user?.tk]);

  return (
    <div className="w-full p-6 min-h-screen bg-gray-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Trip Management</h1>
          <p className="text-gray-500 mt-1">Plan and manage your business trips.</p>
        </div>
        <Link to="/trip/create">
          <Button className="bg-[#0f172a] hover:bg-[#1e293b] text-white">
            <Plus className="mr-2 h-4 w-4" /> Create Trip
          </Button>
        </Link>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-4 border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-gray-900">Managed Trips</CardTitle>
          <CardDescription className="text-gray-500">
            Overview of trips you have organized.
          </CardDescription>
        </CardHeader>
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
                  Participants
                </TableHead>
                <TableHead className="w-[15%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <Loader2 className="animate-spin h-6 w-6 text-gray-400 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : trips.length > 0 ? (
                trips.map((trip) => (
                  <TableRow
                    key={trip.id}
                    className="hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer transition-colors"
                    onClick={() => setActiveTripId(trip.id)}
                  >
                    <TableCell className="py-4 pl-6 font-medium text-gray-900">
                      {trip.title}
                    </TableCell>
                    <TableCell className="py-4 text-gray-600">{trip.destination}</TableCell>
                    <TableCell className="py-4 text-gray-600 text-sm">{trip.dates}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        {trip.participants}
                      </div>
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
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                    No trips found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!activeTripId} onOpenChange={(open) => !open && setActiveTripId(null)}>
        <SheetContent className="sm:max-w-xl w-full flex flex-col h-full bg-white p-0 gap-0">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>Trip Details</SheetTitle>
            <SheetDescription>View detailed information about this trip.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
            {activeTripId && (
              <TripDetail tripId={activeTripId} onClose={() => setActiveTripId(null)} />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
