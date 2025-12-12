import { createLazyFileRoute } from '@tanstack/react-router';
import { useAuth } from '../hooks/AuthContext';
import { useState } from 'react';

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

  const formatCurrency = (amount) => `$${amount}`;

  const getStatusBadge = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}
      >
        {status}
      </span>
    );
  };

  const RequestList = ({ items }) => (
    <div className="space-y-3">
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No requests found</p>
        </div>
      ) : (
        items.map((request) => (
          <div
            key={request.id}
            className="bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{request.title}</p>
                <p className="text-gray-600 text-sm">{request.requestorName}</p>
                <p className="text-gray-500 text-xs mt-1">{request.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{formatCurrency(request.amount)}</p>
                <div className="mt-1">{getStatusBadge(request.status)}</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'all' && <RequestList items={allRequests} />}
        {activeTab === 'paid' && <RequestList items={paidRequests} />}
        {activeTab === 'rejected' && <RequestList items={rejectedRequests} />}
      </div>
    </div>
  );
}
