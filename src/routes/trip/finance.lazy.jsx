import { createLazyFileRoute } from '@tanstack/react-router';
import { useAuth } from '../../hooks/AuthContext';
import { router } from '../../router';
import { Check, RotateCcw, X, DollarSign } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
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
import TripDetail from '@/components/TripDetail';
import getTripFinance from '@/api/trip/getTripFinance';
import putTripFinanceReview from '@/api/trip/putTripFinanceReview';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export const Route = createLazyFileRoute('/trip/finance')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isFinance } = useAuth();

  const [modalState, setModalState] = useState({ isOpen: false, type: null, requestId: null });
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // --- 1. REVISED MOCK DATA STRUCTURE ---
  const fetchRequests = async () => {
    if (!user?.tk) return;
    try {
      setIsLoading(true);
      const response = await getTripFinance(user.tk, currentPage, itemsPerPage);
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

  useEffect(() => {
    console.log('active request content: ' + activeRequest);
  }, [activeRequest]);
  // ----------------------------------------

  const openAction = (id, type) => {
    setModalState({ isOpen: true, type, requestId: id });
  };

  const handleConfirmAction = async (requestId, cost) => {
    if (!user?.tk) return;

    const submitedData = {
      isApproved: true,
      allocatedCost: cost,
      rejectionReason: 'string',
    };

    try {
      setIsSubmitting(true);
      console.log(submitedData);
      await putTripFinanceReview(requestId, submitedData, user.tk);
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        title: 'Cost Updated',
        text: `Trip cost set to ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(submitedData.allocatedCost)}`,
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
      
      // Refresh list: logic to handle page if item removed
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
          <Table>
            <TableHeader>
              <TableRow className="bg-transparent hover:bg-transparent border-b border-gray-100">
                <TableHead className="w-[30%] py-4 pl-6 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Title
                </TableHead>
                <TableHead className="w-[20%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Destination
                </TableHead>
                <TableHead className="w-[20%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Dates
                </TableHead>
                <TableHead className="w-[15%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Participants
                </TableHead>
                <TableHead className="w-[15%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests?.map((req) => (
                <TableRow
                  key={req.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setActiveRequest(req.id)}
                >
                  <TableCell className="py-4 pl-6 font-medium text-gray-900">{req.title}</TableCell>
                  <TableCell className="py-4 text-gray-600">{req.destination}</TableCell>
                  <TableCell className="py-4 text-gray-600 text-sm">
                    {format(new Date(req.startDate), 'dd MMM yyyy')} -{' '}
                    {format(new Date(req.endDate), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      {req.participants.length}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-600 hover:bg-gray-200 font-normal rounded-full px-3"
                    >
                      {req.status}
                    </Badge>
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
      />

      <Sheet open={!!activeRequest} onOpenChange={(open) => !open && setActiveRequest(null)}>
        <SheetContent className="sm:max-w-xl w-full flex flex-col h-full bg-white p-0 gap-0">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>Trip Details</SheetTitle>
            <SheetDescription>View detailed information about this trip.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
            {activeRequest ? (
              <TripDetail
                tripId={activeRequest}
                onClose={() => setActiveRequest(null)}
                userRole="Finance"
                onAction={(actionType) => openAction(activeRequest, actionType)}
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

// (ActionModal component remains the same for brevity, but should be included)

const ActionModal = ({ isOpen, onClose, actionType, requestId, onConfirm }) => {
  const [cost, setCost] = useState('');
  const [comment, setComment] = useState('');

  useState(() => {
    if (!isOpen) {
      setCost('');
      setComment('');
    }
  }, [isOpen]);

  const handleCostChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setCost(value);
  };

  const isConfirmDisabled = actionType === 0 && (!cost || isNaN(parseFloat(cost)));

  const handleConfirmation = () => {
    if (actionType === 0) {
      const finalCost = parseFloat(cost) || 0;
      onConfirm(requestId, finalCost);
    } else {
      onConfirm(requestId, null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Trip Cost Assignment</DialogTitle>
          <DialogDescription>
            Input the final approved cost for reimbursement request.
          </DialogDescription>
        </DialogHeader>

        {actionType === 0 && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="cost" className="text-right">
                Approved Cost
              </label>
              <Input
                id="cost"
                type="text"
                placeholder="0.00"
                value={cost}
                onChange={handleCostChange}
                className="col-span-3"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirmation} disabled={isConfirmDisabled}>
            Confirm Cost
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
