import { createLazyFileRoute } from '@tanstack/react-router';
import { useAuth } from '../../hooks/AuthContext';
import { router } from '../../router';
import ReimbursementList from '../../components/ReimbursementList';

export const Route = createLazyFileRoute('/approval/manager')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isManager } = useAuth();

  // Mock data \
  const requests = [
    {
      id: 1,
      title: 'Travel Expense',
      requestorName: 'John Doe',
      date: '2024-01-15',
      amount: 500,
      status: 'paid',
      category: 'Travel',
    },
    {
      id: 2,
      title: 'Office Supplies',
      requestorName: 'Jane Smith',
      date: '2024-01-10',
      amount: 200,
      status: 'rejected',
      category: 'Supplies',
    },
    {
      id: 3,
      title: 'Conference Fee',
      requestorName: 'Bob Johnson',
      date: '2024-01-05',
      amount: 300,
      status: 'paid',
      category: 'Education',
    },
  ];

  return (
    <>
      {isManager ? (
        <div className="p-6 pl-10 pr-10 bg-gray-50 min-h-screen">
          <h1 className="text-2xl font-bold mb-6">History</h1>
          <p className="text-gray-600 mb-6">All reimbursement requests</p>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">All Pending Approval Request</div>
          </div>

          {/* Content */}
          <div>
            <ReimbursementList items={requests} />
          </div>
        </div>
      ) : (
        router.navigate({ to: '/dashboard' })
      )}
    </>
  );
}
