import React, { useEffect, useState } from 'react';
import { Loader2, PlaneTakeoff, ChevronRight, Lock } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
import { useAuth } from '@/hooks/AuthContext';
import getTripAssigned from '@/api/trip/getTripAssigned';
import getTripAssignedReimbursement from '@/api/trip/getTripAssignedReimbrusement';
import getReimbursementById from '@/api/reimbursement/getReimbursementById';

export default function OngoingTripWidget() {
  const { user } = useAuth();
  const router = useRouter();
  const [trips, setTrips] = useState([]);
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

        const ongoingOnly = Array.isArray(data) ? data.filter((t) => t.status === 'Ongoing') : [];

        const tripPlus = await Promise.all(
          ongoingOnly.map(async (trip) => {
            const rId = await getTripAssignedReimbursement(trip.id, user.tk);
            const reimb = await getReimbursementById(rId, user.tk);
            const latestStatus = reimb.logs?.at(-1)?.action || 'No Status';
            
            return { ...trip, reimbursementId: rId, reimbursementStatus: latestStatus };
          })
        );

        setTrips(tripPlus);
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

  const handleUpdate = (reimbursementId) => {
    router.navigate({
      to: '/reimbursement/update',
      search: { id: reimbursementId },
    });
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
      {trips.map((trip) => {
        // Updated Condition: Locked if NOT Drafted (e.g., Submitted, Approved, etc.)
        const isLocked = trip.reimbursementStatus !== 'Drafted';

        return (
          <div
            key={trip.id}
            className={`transition-transform ${!isLocked ? 'active:scale-[0.99]' : ''}`}
            onClick={() => !isLocked && handleUpdate(trip.reimbursementId)}
          >
            <div 
              className={`w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between transition-all 
                ${isLocked ? 'cursor-not-allowed opacity-80 bg-gray-50/50' : 'hover:shadow-md cursor-pointer border-l-4 border-l-[#003366]'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full shrink-0 ${isLocked ? 'bg-gray-100' : 'bg-blue-50'}`}>
                  <PlaneTakeoff className={`h-5 w-5 ${isLocked ? 'text-gray-400' : 'text-[#003366]'}`} />
                </div>

                <div className="flex flex-col">
                  <span className={`text-[10px] font-bold uppercase tracking-widest opacity-70 ${isLocked ? 'text-gray-500' : 'text-blue-800'}`}>
                    {isLocked ? 'Request Processed' : 'Ongoing Trip'}
                  </span>
                  <h3 className="text-base font-bold text-gray-800 leading-tight">
                    {trip.title || 'Untitled Trip'}
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    Budget coverage:{' '}
                    <span className="text-gray-700">{formatCurrency(trip.cost || 0)}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-400 group">
                <span className={`text-xs font-medium hidden sm:block transition-colors ${!isLocked ? 'group-hover:text-[#003366]' : ''}`}>
                  {isLocked ? 'reimbursement request submitted' : 'update your spent'}
                </span>
                {isLocked ? (
                  <Lock className="h-4 w-4 text-gray-300" />
                ) : (
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}