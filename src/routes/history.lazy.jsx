import { createLazyFileRoute } from '@tanstack/react-router';
import { useState, useMemo, useEffect } from 'react';
import { FileClock, Loader2 } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

import ReimbursementList, { getLatestAction } from '../components/ReimbursementList';
import ReimbursementFilter from '../components/ReimbursementFilter';
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

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState(null);

  const [detailData, setDetailData] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user || !user.tk) return;

      try {
        const response = await getReimbursementMe(user.tk);
        setData(response || []);
      } catch (error) {
        router.navigate({
          to: '/error',
          replace: true,
          search: {
            status: error.status || 500,
            msg: error.message || 'An unexpected error occurred.',
          },
        });
      }
    };

    fetchRequests();
  }, [user?.tk, router]); 

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
        console.error('Failed to fetch details', error);
      } finally {
        setIsDetailLoading(false);
      }
    };

    fetchDetail();
  }, [selectedId, user?.tk]);

  const allRequests = data || [];

  const filteredRequests = useMemo(() => {
    return allRequests.filter((request) => {
      const matchesSearch = request.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      
      const latestAction = getLatestAction(request);
      const matchesStatus = statusFilter === 'all' || latestAction === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, allRequests]);

  const handleRowClick = (id) => {
    setSelectedId(id);
  };

  const closeDetail = () => {
    setSelectedId(null);
    setDetailData(null);
  };

  const isFetching = data === null;

  return (
    <div className="bg-gray-50 min-h-full">

      <ReimbursementFilter 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />

      {/* Content */}
      <div className="mt-4">
        {/* If data is null (first render), show the "No requests found" section as a silent loading indicator. */}
        {isFetching || filteredRequests.length === 0 ? (
          <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center py-16 text-center text-muted-foreground transition-all">
            <FileClock className="h-12 w-12 mb-4 text-gray-300" />
            <p>
              {isFetching
                ? 'Loading history...'
                : 'No requests matched your search filters.'}
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
            <SheetDescription>View the details of your reimbursement request.</SheetDescription>
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
