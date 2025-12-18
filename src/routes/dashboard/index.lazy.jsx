import { createLazyFileRoute, Outlet } from '@tanstack/react-router';
import { useState } from 'react';

import SummaryWidget from '@/components/dashboard/SummaryWidget';
import ActiveLimitsWidget from '@/components/dashboard/ActiveLimitsWidget';
import { router } from '@/router';
import OngoingTripWidget from '@/components/dashboard/OngoingTripWidget';
import LimitChartWidget from '@/components/dashboard/LimitChartWidget';

export const Route = createLazyFileRoute('/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [limits, setLimits] = useState([]);

  const handleCategoryClick = (limit) => {
    // console.log(limit.categoryName);
    router.navigate({
      to: '/reimbursement',
      search: {
        categoryId: limit.categoryId,
        categoryName: limit.categoryName,
      },
    });
  };
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mt-6">
        <SummaryWidget />
      </div>
      <div className="mt-8">
        <ActiveLimitsWidget onQuickClaim={handleCategoryClick} />
      </div>
      <div className="mt-6">
        <OngoingTripWidget />
      </div>
      <div className="mt-4">
        <LimitChartWidget />
      </div>
    </div>
  );
}
