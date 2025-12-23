import ManagerRevisionTracker from '@/components/dashboard/manager/ManagerRevisionTracker';
import ManagerSummaryWidget from '@/components/dashboard/manager/ManagerSummaryWidget';
import TripCalendarWidget from '@/components/dashboard/manager/TripCalendarWidget';
import { useAuth } from '@/hooks/AuthContext';
import { router } from '@/router';
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/manager')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isManager } = useAuth();
  
    if (!isManager) {
      router.navigate({
        to: '/error',
        search: {
          status: 403,
          msg: 'Need Manager Role',
        },
      });
    }
  return (
      <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
        <div className="mt-6">
          <ManagerSummaryWidget/>
        </div>
        <div className="mt-8">
          <ManagerRevisionTracker/>
        </div>
        <div className="mt-6">
          <TripCalendarWidget/>
        </div>
        {/* <div className="mt-4">placeholder</div> */}
      </div>
    );
}
