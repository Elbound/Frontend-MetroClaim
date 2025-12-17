import { createLazyFileRoute } from '@tanstack/react-router';
import { useState, useMemo, useEffect } from 'react';
import { FileClock, Loader2 } from 'lucide-react';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

import ReimbursementList from '../components/ReimbursementList';
import ReimbursementDetail from '../components/ReimbursementDetail.jsx';
import getReimbursementMe from '@/api/reimbursement/getReimbursementMe';
import getReimbursementById from '@/api/reimbursement/getReimbursementById';
import { useAuth } from '@/hooks/AuthContext';
import { router } from '@/router';

export const Route = createLazyFileRoute('/history')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState(null);
  
  // Detail fetch state
  const [detailData, setDetailData] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

 useEffect(() => {
    const fetchRequests = async () => {
      if (!user || !user.tk) return;

      try {
        const response = await getReimbursementMe(user.tk);
        setData(response || []);
      } catch (err) {
        console.error('>>>>>>>Error fetching data:', err.status);

        router.navigate({
          to: '/error',
          replace: true,
          search: { 
            status: err.status || 500, 
            msg: err.message || "An unexpected error occurred" 
          }
        });

      }
    };

    fetchRequests();
  }, [user?.tk, router]); // Added router to dependency array

  // Fetch full details when selectedId changes
  useEffect(() => {
    const fetchDetail = async () => {
      if (!selectedId || !user?.tk) {
        setDetailData(null);
        return;
      }

      setIsDetailLoading(true);
      try {
        const detail = await getReimbursementById(selectedId, user.tk);
        setDetailData(detail);
      } catch (error) {
        console.error("Failed to fetch details", error);
      } finally {
        setIsDetailLoading(false);
      }
    };

    fetchDetail();
  }, [selectedId, user?.tk]);

  const allRequests = data || [];

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
  }, [activeTab, allRequests]); 

  const handleRowClick = (id) => {
    setSelectedId(id);
  };

  const closeDetail = () => {
    setSelectedId(null);
    setDetailData(null); 
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

  
  const isFetching = data === null; 

  return (
    <div className="p-6 pl-10 pr-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-2 text-gray-900">Reimbursement History</h1>
      <p className="text-gray-500 mb-6">View and track all your submitted requests.</p>

      {/* Tabs */}
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
        {/* If data is null (first render), show the "No requests found" section as a silent loading indicator. */}
        {isFetching || filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <FileClock className="h-12 w-12 mb-4 text-gray-300" />
            <p>
              {isFetching
                ? 'Loading history...'
                : `No requests found in the **${activeTab}** category.`}
            </p>
          </div>
        ) : (
          <ReimbursementList items={filteredRequests} onRowClick={handleRowClick} />
        )}
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selectedId} onOpenChange={(open) => !open && closeDetail()}>
        <SheetContent className="sm:max-w-xl w-full flex flex-col h-full">
          <SheetHeader className="mb-4">
            <SheetTitle>Claim Details</SheetTitle>
            <SheetDescription>
              View the details of your reimbursement request.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {isDetailLoading ? (
               <div className="flex items-center justify-center h-40">
                 <Loader2 className="w-8 h-8 animate-spin text-primary" />
               </div>
            ) : detailData ? (
              <ReimbursementDetail
                detailData={detailData}
                onClose={closeDetail}
                userRole="Employee"
              />
            ) : (
              <p className="p-4 text-center text-muted-foreground">
                Please select an item to view details.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
