import { createLazyFileRoute } from '@tanstack/react-router';
import { useState, useMemo, useEffect } from 'react';
import {
  FileClock,
  Loader2,
} from 'lucide-react';

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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import getMyReimbursementPaged from '@/api/paginated/getMyReimbursementPaged';
import getPagedData from '@/api/paginated/getPagedData';

export const Route = createLazyFileRoute('/history')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [detailData, setDetailData] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user || !user.tk) return;

      try {
        const { data, pages } = await getPagedData(currentPage, user.tk,"reimbursement/me");
        setData(data || []);
        setTotalPage(pages || 1);
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
  }, [user?.tk, currentPage, router]);

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
      const matchesSearch =
        request.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;

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

  const handlePageChange = (change) => {
    const nextPage = currentPage + change;
    if (nextPage <= 0) return;
    if (totalPage && nextPage > totalPage) return;
    setCurrentPage(nextPage);
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
            <p>{isFetching ? 'Loading history...' : 'No requests matched your search filters.'}</p>
          </div>
        ) : (
          <ReimbursementList items={filteredRequests} onRowClick={handleRowClick} />
        )}
      </div>

      {/* <div className="flex flex-row mt-3 items-center justify-center">
        <button
        onClick={handlePageChange(-1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ArrowBigLeft className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-2 font-medium text-sm">
        <span className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
          {currentPage}
        </span>
        <span className="text-muted-foreground">of</span>
        <span>{totalPage || 1}</span>
      </div>

      <button
        onClick={handlePageChange(1)}
        disabled={currentPage === totalPage}
        className="p-2 rounded-md hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ArrowBigRight className="w-6 h-6" />
      </button>
      </div> */}

      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(-1);
              }}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

          <div className="text-sm font-medium px-4 select-none">
            Page {currentPage} of {totalPage || 1}
          </div>

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(1);
              }}
              className={
                currentPage === totalPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

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
