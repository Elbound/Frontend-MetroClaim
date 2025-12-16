import { createLazyFileRoute } from '@tanstack/react-router'
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
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import TripDetail from '@/components/TripDetail';
import { Sheet } from '@/components/ui/sheet';
import getTripFinance from '@/api/trip/getTripFinance';
import putTripFinanceReview from '@/api/trip/putTripFinanceReview';

export const Route = createLazyFileRoute('/trip/finance')({
  component: RouteComponent,
})

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
          console.error("Failed to fetch manager requests", error);
          toast.error("Error", { description: "Failed to load approval list." });
      } finally {
          setIsLoading(false);
      }
    };
  
    useEffect(() => {
        fetchRequests();
      }, [user?.tk]);
  // ----------------------------------------

  const openAction = (id, type) => {
    setModalState({ isOpen: true, type, requestId: id });
  };
  
  const handleConfirmAction = async (requestId, cost) => {
   
    if (!user?.tk) return;
        try {
            setIsSubmitting(true);
            await putTripFinanceReview(requestId, cost, user.tk);
            toast.success("Success", { description: "Reimbursement status updated." });
            setModalState({ isOpen: false, type: null, requestId: null });
            setActiveRequest(null); // Close detail view
            fetchRequests(); // Refresh list
        } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed", { description: error.message || "Could not update status." });
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
              <TableRow>
                {/* --- 2. REVISED TABLE HEADERS --- */}
                <TableHead>Title</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Requested Amount</TableHead>
             
                {/* ---------------------------------- */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests?.map((req) => (
                <TableRow key={req.id}>
                  {/* --- 3. REVISED TABLE CELLS --- */}
                  
                  {/* Title and Employee */}
                  <TableCell className="font-medium">
                    <div>{req.title}</div>
                    <div className="text-xs text-gray-500">{req.employeeName || req.employeeId}</div>
                  </TableCell>

                  {/* Start/End Date */}
                  <TableCell>
                    <div>{req.start_date}</div>
                    <div className="text-xs text-gray-500">to {req.end_date}</div>
                  </TableCell>

                  {/* Destination */}
                  <TableCell>{req.destination}</TableCell>

                  {/* Requested Amount */}
                  <TableCell>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                      req.totalAmount || 0
                    )}
                  </TableCell>

                  {/* Actions */}
                 
                  {/* ---------------------------------- */}
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
            <SheetDescription>
              View the details of the reimbursement request.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {activeRequest ? (
              <TripDetail
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
      onConfirm(requestId, finalCost );
    } else {
      onConfirm(requestId,  null); 
    }
  }

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
          <Button
            onClick={handleConfirmation}
            disabled={isConfirmDisabled}
          >
            Confirm Cost
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};