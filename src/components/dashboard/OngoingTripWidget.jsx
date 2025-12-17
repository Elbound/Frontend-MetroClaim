import React, { useEffect, useState } from 'react';
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
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-center">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (trips.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-bold mb-1 ml-1">Ongoing Trips</h2>
      {trips.map((trip) => (
        <div 
          key={trip.id} 
          className="transition-transform active:scale-[0.99]"
          onClick={() => handleUpdate(trip.id)} // Pass ID on click
        >
          <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-full shrink-0">
                  <PlaneTakeoff className="h-5 w-5 text-[#003366]" />
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-800 opacity-70">
                    Ongoing Trip
                  </span>
                  <h3 className="text-base font-bold text-gray-800 leading-tight">
                    {trip.title || 'Untitled Trip'}
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    Budget coverage: <span className="text-gray-700">{formatCurrency(trip.cost || 0)}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-400 group">
                <span className="text-xs font-medium hidden sm:block group-hover:text-[#003366] transition-colors">update your spent</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
          </div>
        </div>
      ))}
    </div>
  );
}