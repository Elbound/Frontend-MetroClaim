import getReimbursementManager from '@/api/reimbursement/getReimbursementManager';
import getReimbursementManagerRevisionSummary from '@/api/reimbursement/getReimbursementManagerRevisionSummary';
import getTripManager from '@/api/trip/getTripManager';
import ManagerRevisionTracker from '@/components/dashboard/manager/ManagerRevisionTracker';
import ManagerSummaryWidget from '@/components/dashboard/manager/ManagerSummaryWidget';
import TripCalendarWidget from '@/components/dashboard/manager/TripCalendarWidget';
import { useAuth } from '@/hooks/AuthContext';
import { router } from '@/router';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createLazyFileRoute('/dashboard/manager')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isManager, user } = useAuth();

  const [managerStats, setManagerStats] = useState({
    pendingApproval: 0,
    TripFinanceApproved: 0,
    TripOngoing: 0,
  });
  const [revisionState, setRevisionState] = useState({
    pendingRevision: 0,
    finishRevision: 0,
  });

  const [tripData, setTripData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [reimbursementData, tripData] = await Promise.all([
      getReimbursementManager(user.tk),
      getTripManager(user.tk),
    ]);
    const financeApproved = tripData?.filter((t) => t.status === 'FinanceApproved')?.length || 0;
    const ongoing = tripData?.filter((t) => t.status === 'Ongoing')?.length || 0;

    setManagerStats({
      pendingApproval: reimbursementData?.length || 0,
      TripFinanceApproved: financeApproved,
      TripOngoing: ongoing,
    });
  };

  const fetchRevision = async () => {
    setLoading(true);

    const summaryData = await getReimbursementManagerRevisionSummary(user.tk);

    setRevisionState({
      pendingRevision: summaryData.pendingRevision || 0,
      finishRevision: summaryData.finishRevision || 0,
    });
  };

  const fetchTrips = async () => {
    setLoading(true);
    const allTripData = await getTripManager(user.tk);
    const ongoingTrips = allTripData?.filter((t) => t.status === 'Ongoing') || [];
    setTripData(ongoingTrips);
  };

  useEffect(() => {
    if (!user?.tk) return;
    setLoading(true);
    try {
      fetchData();
      fetchRevision();
      fetchTrips();
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
  }, [user?.tk]);

  if (!isManager) {
    router.navigate({
      to: '/login',
      search: {
        status: 403,
        msg: 'Need Manager Role',
      },
    });
  }
  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="mt-6">
        <ManagerSummaryWidget statData={managerStats} summaryLoading={loading} />
      </div>
      <div className="mt-8">
        <ManagerRevisionTracker revisionData={revisionState} revisionTrackerLoading={loading} />
      </div>
      <div className="mt-6">
        <TripCalendarWidget tripsData={tripData} tripCalendarLoading={loading}/>
      </div>
      {/* <div className="mt-4">placeholder</div> */}
    </div>
  );
}
