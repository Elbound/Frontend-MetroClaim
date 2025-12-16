import { createLazyFileRoute, Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import UserLimit from '../components/UserLimit';
import SummaryWidget from '../components/dashboard/SummaryWidget';
import ActiveLimitsWidget from '../components/dashboard/ActiveLimitsWidget';
import { router } from '@/router';

export const Route = createLazyFileRoute('/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const [limits, setLimits] = useState([]);

  const handleCategoryClick = (limit) => {
    console.log(limit.categoryName);
    router.navigate({
      to: '/reimbursement',
      state: {
        categoryId: limit.id, 
      },
    });
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mt-6">
        <SummaryWidget />
      </div>
      <div className="mt-8">
        <ActiveLimitsWidget onQuickClaim={handleCategoryClick} />
      </div>
    </div>
  );
}
