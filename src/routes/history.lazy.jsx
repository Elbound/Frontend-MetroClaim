import { createLazyFileRoute } from '@tanstack/react-router';
import { useAuth } from '../hooks/AuthContext';
import { useState } from 'react';
import ReimbursementList from '../components/ReimbursementList';

export const Route = createLazyFileRoute('/history')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isManager, isFinance, logOut } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  // Mock data - replace with actual data fetching
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

  const allRequests = requests;
  const paidRequests = requests.filter((r) => r.status === 'paid');
  const rejectedRequests = requests.filter((r) => r.status === 'rejected');
  const pendingRequests = requests.filter((r) => r.status === 'pending')


  return (
    <div className="p-6 pl-10 pr-10 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">History</h1>
      <p className="text-gray-600 mb-6">All reimbursement requests</p>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({allRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'paid' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Paid ({paidRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'rejected' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rejected ({rejectedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'pending' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending ({pendingRequests.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'all' && <ReimbursementList items={allRequests} />}
        {activeTab === 'paid' && <ReimbursementList items={paidRequests} />}
        {activeTab === 'rejected' && <ReimbursementList items={rejectedRequests} />}
        {activeTab === 'pending' && <ReimbursementList items={pendingRequests} />}
      </div>
    </div>
  );
}
