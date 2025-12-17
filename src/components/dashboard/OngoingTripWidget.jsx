import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, PlaneTakeoff, ChevronRight } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
import { useAuth } from '@/hooks/AuthContext';
import getTripAssigned from '@/api/trip/getTripAssigned';
import getTripAssignedReimbursement from '@/api/trip/getTripAssignedReimbrusement';

export default function OngoingTripWidget() {
  const { user } = useAuth();
  const router = useRouter();
  const [trips, setTrips] = useState([]); // Changed to array
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user?.tk) return;
      try {
        setLoading(true);
        const data = await getTripAssigned(user.tk);
        
        // Filter for ongoing trips before setting state
        const ongoingOnly = Array.isArray(data) 
          ? data.filter(t => t.status === 'Ongoing') 
          : [];
          
        setTrips(ongoingOnly);
      } catch (error) {
        router.navigate({
          to: '/error',
          search: {
            status: error.status || 500,
            msg: error.message || 'Failed to load assigned trips.',
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user?.tk]);

  const handleUpdate = async (tripId) => {
    if (!user?.tk) return;
    try {
      setLoading(true);
      // Fetches the specific reimbursement ID linked to this trip
      const reimbursementId = await getTripAssignedReimbursement(tripId, user.tk);

      router.navigate({
        to: '/reimbursement/update',
        search: { id: reimbursementId },
      });
    } catch (error) {
      router.navigate({
        to: '/error',
        search: {
          status: error.status || 500,
          msg: error.message || 'Failed to load reimbursement details.',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="py-6 flex justify-center">
          <Loader2 className="animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (trips.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {trips.map((trip) => (
        <div 
          key={trip.id} 
          className="transition-transform active:scale-[0.98]"
          onClick={() => handleUpdate(trip.id)} // Pass ID on click
        >
          <Card className="w-full border-l-4 border-l-indigo-500 hover:bg-slate-50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <PlaneTakeoff className="h-5 w-5 text-indigo-600" />
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                    Ongoing Trip
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {trip.title || 'Untitled Trip'}
                  </h3>
                  <p className="text-sm font-medium text-slate-500">
                    Budget: <span className="text-slate-700">{formatCurrency(trip.cost || 0)}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-xs font-medium">Update Expenses</span>
                <ChevronRight className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}