import { createLazyFileRoute, Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import UserLimit from '../components/UserLimit';

export const Route = createLazyFileRoute('/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const [limits, setLimits] = useState([]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-row gap-4 mt-6 justify-between">
        <div className="w-[30%] bg-amber-100 p-6 border-2">
          <h2 className="mb-2">Create New User Limit</h2>
          <p className="text-blue-600">Set up limits for users here.</p>
        </div>
        <div className="w-[60%] bg-red-100 p-6 border-2">
          <h2 className="mb-2">Item 2</h2>
          <p className="text-gray-600">Placeholder</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">User Limits</h2>
        <div className="flex flex-wrap gap-4 justify-between">
          <UserLimit />
          <UserLimit />
          <UserLimit />
          <UserLimit />
          <UserLimit />
        </div>
      </div>
    </div>
  );
}
