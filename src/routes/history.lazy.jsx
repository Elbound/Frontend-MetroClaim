import { createLazyFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { FileClock } from 'lucide-react';

// --- NEW IMPORTS ---
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ReimbursementList from '../components/ReimbursementList'; // Will be updated
import ReimbursementDetail from '../components/ReimbursementDetail.jsx'; // NEW Component

export const Route = createLazyFileRoute('/history')({
  component: RouteComponent,
});

// Mock Data (Expanded to include details needed for the sheet)
const mockRequests = [
  {
    id: 'REIMB-001',
    title: 'Travel Expense Q1',
    requestorName: 'John Doe',
    date: '2024-01-15',
    amount: 500000,
    status: 'Approved', // Match your first component's statuses
    category: 'Travel',
    description: 'Flight and accommodation for Jakarta business trip.',
    items: [
      {
        id: 'i1',
        dateOfExpense: '2024-01-14',
        amount: 300000,
        receipt: '/mock-receipt-flight.jpg',
      },
      { id: 'i2', dateOfExpense: '2024-01-15', amount: 200000, receipt: '/mock-receipt-hotel.jpg' },
    ],
    logs: [
      {
        id: 'l1',
        createdAt: '2024-01-15T10:00:00Z',
        action: 'Submitted',
        approverName: 'John Doe',
      },
      {
        id: 'l2',
        createdAt: '2024-01-16T15:30:00Z',
        action: 'ManagerApproved',
        approverName: 'Manager A',
      },
    ],
  },
  {
    id: 'REIMB-002',
    title: 'Office Supplies - Jan',
    requestorName: 'Jane Smith',
    date: '2024-01-10',
    amount: 200000,
    status: 'Rejected',
    category: 'Supplies',
    description: 'Purchase of stationary and printer ink.',
    items: [
      { id: 'i3', dateOfExpense: '2024-01-09', amount: 200000, receipt: '/mock-receipt-ink.jpg' },
    ],
    logs: [
      {
        id: 'l3',
        createdAt: '2024-01-10T09:00:00Z',
        action: 'Submitted',
        approverName: 'Jane Smith',
      },
      {
        id: 'l4',
        createdAt: '2024-01-10T11:00:00Z',
        action: 'Rejected',
        approverName: 'Manager B',
        comment: 'Receipt total amount is incorrect.',
      },
    ],
  },
  {
    id: 'REIMB-003',
    title: 'Client Dinner',
    requestorName: 'Bob Johnson',
    date: '2024-01-05',
    amount: 300000,
    status: 'Submitted', // Pending approval
    category: 'Entertainment',
    description: 'Dinner with client ABC on 04/01/2024.',
    items: [
      {
        id: 'i4',
        dateOfExpense: '2024-01-04',
        amount: 300000,
        receipt: '/mock-receipt-dinner.jpg',
      },
    ],
    logs: [
      {
        id: 'l5',
        createdAt: '2024-01-05T08:00:00Z',
        action: 'Submitted',
        approverName: 'Bob Johnson',
      },
    ],
  },
];

function RouteComponent() {
  // 1. Data and Filtering (useMemo is a good practice for heavy filtering)
  const [activeTab, setActiveTab] = useState('all');

  const allRequests = mockRequests;
  const filteredRequests = useMemo(() => {
    switch (activeTab) {
      case 'paid':
        return allRequests.filter((r) => r.status === 'Approved' || r.status === 'FinanceApproved');
      case 'rejected':
        return allRequests.filter((r) => r.status === 'Rejected');
      case 'pending':
        return allRequests.filter(
          (r) =>
            r.status === 'Submitted' || r.status === 'Pending' || r.status === 'ManagerApproved'
        );
      case 'all':
      default:
        return allRequests;
    }
  }, [activeTab]);

  // 2. Detail Sheet State
  const [selectedId, setSelectedId] = useState(null);

  // Find the selected reimbursement object from mock data
  const selectedRequest = useMemo(() => {
    return mockRequests.find((r) => r.id === selectedId);
  }, [selectedId]);

  const handleRowClick = (id) => {
    setSelectedId(id);
  };

  const closeDetail = () => {
    setSelectedId(null);
  };

  const tabs = [
    { key: 'all', label: `All (${allRequests.length})` },
    {
      key: 'pending',
      label: `Pending (${allRequests.filter((r) => r.status === 'Submitted' || r.status === 'Pending').length})`,
    },
    {
      key: 'paid',
      label: `Approved/Paid (${allRequests.filter((r) => r.status === 'Approved' || r.status === 'FinanceApproved').length})`,
    },
    {
      key: 'rejected',
      label: `Rejected (${allRequests.filter((r) => r.status === 'Rejected').length})`,
    },
  ];

  return (
    <div className="p-6 pl-10 pr-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-2 text-gray-900">Reimbursement History</h1>
      <p className="text-gray-500 mb-6">View and track all your submitted requests.</p>

      {/* Tabs (Improved with shadcn/ui principles) */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredRequests.length > 0 ? (
          <ReimbursementList items={filteredRequests} onRowClick={handleRowClick} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <FileClock className="h-12 w-12 mb-4 text-gray-300" />
            <p>No requests found in the **{activeTab}** category.</p>
          </div>
        )}
      </div>

      {/* Detail Sheet (Replaces the large sheet section from your original component) */}
      <Sheet open={!!selectedId} onOpenChange={(open) => !open && closeDetail()}>
        <SheetContent className="sm:max-w-xl w-full flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>Claim Details</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto">
            {selectedRequest && (
              <ReimbursementDetail
                detailData={selectedRequest}
                onClose={closeDetail}
                // Mocking the user role for now
                userRole="Employee"
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
