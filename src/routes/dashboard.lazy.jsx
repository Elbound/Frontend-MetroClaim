import { createLazyFileRoute, Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import UserLimit from '../components/UserLimit';
import SummaryWidget from '../components/dashboard/SummaryWidget';
import ActiveLimitsWidget from '../components/dashboard/ActiveLimitsWidget';

export const Route = createLazyFileRoute('/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const [limits, setLimits] = useState([]);


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mt-6">
        <SummaryWidget />
      </div>
      <div className="mt-8">
        <ActiveLimitsWidget onQuickClaim={(categoryName) => console.log(`Quick claim for: ${categoryName}`)} />
      </div>
    </div>
  );
}
