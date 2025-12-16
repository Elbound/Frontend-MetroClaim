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

  // --- 1. REVISED MOCK DATA STRUCTURE ---
  const fetchRequests = async () => {
    if (!user?.tk) return;
    try {
      setIsLoading(true);
      const data = await getTripFinance(user.tk);
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch manager requests', error);
      toast.error('Error', { description: 'Failed to load approval list.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user?.tk]);

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
      console.log(submitedData)
      await putTripFinanceReview(requestId, submitedData, user.tk);
      toast.success('Success', { description: 'Reimbursement status updated.' });
      setModalState({ isOpen: false, type: null, requestId: null });
      setActiveRequest(null); // Close detail view
      fetchRequests(); // Refresh list
    } catch (error) {
      console.error('Update failed', error);
      toast.error('Failed', { description: error.message || 'Could not update status.' });
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
                      testest
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

      <ActionModal
        isOpen={modalState.isOpen}
        actionType={modalState.type}
        requestId={modalState.requestId}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={handleConfirmAction}
      />

      <Sheet open={!!activeRequest} onOpenChange={(open) => !open && setActiveRequest(null)}>
        <SheetContent className="sm:max-w-xl w-full flex flex-col h-full">
          <SheetHeader className="mb-4">
            <SheetTitle>Claim Details</SheetTitle>
            <SheetDescription>View the details of the reimbursement request.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {activeRequest ? (
              <TripDetail
                tripId={activeRequest}
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
