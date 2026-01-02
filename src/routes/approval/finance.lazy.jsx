import { createLazyFileRoute } from '@tanstack/react-router';
import { useAuth } from '../../hooks/AuthContext';
import { router } from '../../router';
import ReimbursementList from '../../components/ReimbursementList';
import { Check, Loader2, RotateCcw, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import getReimbursementFinance from '@/api/reimbursement/getReimbursementFinance';
import patchReimbursementStatus from '@/api/reimbursement/patchReimbursementStatus';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import ReimbursementDetail from '@/components/ReimbursementDetail';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

export const Route = createLazyFileRoute('/approval/finance')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isFinance, user } = useAuth();

  const [modalState, setModalState] = useState({ isOpen: false, type: null, requestId: null });
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchRequests = async () => {
    if (!user?.tk) return;
    try {
      setIsLoading(true);
      const response = await getReimbursementFinance(user.tk, currentPage, itemsPerPage);
      setRequests(response.data || []);
      setTotalPages(Math.ceil((response.meta?.total || 0) / itemsPerPage));
    } catch (error) {
      router.navigate({
        to: '/error',
        replace: true,
        search: {
          status: error.status || 500,
          msg: error.message || 'An unexpected error occurred.',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user?.tk, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openAction = (id, type) => {
    setModalState({ isOpen: true, type, requestId: id });
  };

  const handleConfirmAction = async (id, action, comment) => {
    if (!user?.tk) return;
    try {
      setIsSubmitting(true);
      await patchReimbursementStatus(id, action, comment, user.tk);
      
      // Determine Alert Config based on Action
      let alertConfig = {
        icon: 'success',
        title: 'Action Successful',
        text: 'Reimbursement status has been updated.'
      };

      switch (action) {
        case 0: // Approve
          alertConfig = {
            icon: 'success',
            title: 'Approved!',
            text: 'Reimbursement has been approved.'
          };
          break;
        case 1: // Reject
          alertConfig = {
            icon: 'error',
            title: 'Rejected',
            text: 'Reimbursement has been rejected.'
          };
          break;
        case 2: // Revision
          alertConfig = {
            icon: 'warning',
            title: 'Revision Requested',
            text: 'Reimbursement sent for revision.'
          };
          break;
      }

      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: alertConfig.icon,
        title: alertConfig.title,
        text: alertConfig.text,
        background: '#fff',
        color: '#0f172a',
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      setModalState({ isOpen: false, type: null, requestId: null });
      setActiveRequest(null); // Close detail view
      setModalState({ isOpen: false, type: null, requestId: null });
      setActiveRequest(null); // Close detail view
      
      // Refresh list: if only 1 item on current page (and not page 1), go back one page
      if (requests.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
      } else {
          fetchRequests();
      }
    } catch (error) {
      router.navigate({
        to: '/error',
        replace: true,
        search: {
          status: error.status || 500,
          msg: error.message || 'An unexpected error occurred.',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-6 mt-5 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Pending Approvals</h2>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading requests...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b border-gray-100">
                  <TableHead className="w-[15%] py-4 pl-6 text-gray-500 font-medium text-xs uppercase tracking-wider">
                    Reference ID
                  </TableHead>
                  <TableHead className="w-[25%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                    Title
                  </TableHead>
                  <TableHead className="w-[20%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                    Name
                  </TableHead>
                  <TableHead className="w-[20%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                    Amount
                  </TableHead>
                  <TableHead className="w-[20%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests?.map((req) => (
                  <TableRow
                    key={req.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setActiveRequest(req)}
                  >
                    <TableCell className="py-4 pl-6 font-medium text-gray-900">
                      {req.id ? req.id.substring(0, 8) + '...' : '-'}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-medium text-gray-900">{req.title}</div>
                    </TableCell>
                    <TableCell className="py-4 text-gray-600">{req.userFullName || req.userEmployeeId}</TableCell>
                    <TableCell className="py-4 font-medium text-gray-900">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      }).format(req.totalAmount || 0)}
                    </TableCell>
                    <TableCell className="py-4 text-gray-600">
                      {req.updatedAt ? format(new Date(req.updatedAt), 'dd MMM yyyy HH:mm') : '-'}
                    </TableCell>
                  </TableRow>
                ))}
                {!requests ||
                  (requests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                        All caught up! No pending approvals.
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(currentPage - 1)}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          
          <div className="text-sm font-medium px-4 select-none">
            Page {currentPage} of {totalPages || 1}
          </div>

          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(currentPage + 1)}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <ActionModal
        isOpen={modalState.isOpen}
        actionType={modalState.type}
        requestId={modalState.requestId}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={handleConfirmAction}
        isSubmitting={isSubmitting}
      />

      {/* Detail Sheet */}
      <Sheet open={!!activeRequest} onOpenChange={(open) => !open && setActiveRequest(null)}>
        <SheetContent className="sm:max-w-xl w-full flex flex-col h-full">
          <SheetHeader className="mb-4">
            <SheetTitle>Claim Details</SheetTitle>
            <SheetDescription>View the details of the reimbursement request.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {activeRequest ? (
              <ReimbursementDetail
                detailData={activeRequest}
                onClose={() => setActiveRequest(null)}
                userRole="Manager"
                onAction={(actionType) => openAction(activeRequest.id, actionType)}
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

const ActionModal = ({ isOpen, onClose, actionType, requestId, onConfirm, isSubmitting }) => {
  const [comment, setComment] = useState('');

  // Reset comment when opening
  useEffect(() => {
    if (isOpen) setComment('');
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-md z-[110]">
        <DialogHeader>
          <DialogTitle>
            {actionType === 0
              ? 'Approve Request?'
              : actionType === 1
                ? 'Reject Request'
                : 'Request Revision'}
          </DialogTitle>
          <DialogDescription>
            {actionType === 0
              ? 'Are you sure you want to approve this request?'
              : 'Please provide a reason.'}
          </DialogDescription>
        </DialogHeader>

        {(actionType === 1 || actionType === 2) && (
          <textarea
            className="w-full border rounded-md p-2 text-sm mb-4"
            disabled={isSubmitting}
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        )}

        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant={actionType === 1 ? 'destructive' : 'default'}
            onClick={() => onConfirm(requestId, actionType, comment)}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
