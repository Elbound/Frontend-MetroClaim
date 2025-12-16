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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { format } from 'date-fns';
import ReimbursementDetail from '@/components/ReimbursementDetail';



export const Route = createLazyFileRoute('/approval/finance')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isFinance, user} = useAuth();


  const [modalState, setModalState] = useState({ isOpen: false, type: null, requestId: null });
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);

  // Mock data \
  const fetchRequests = async () => {
    if (!user?.tk) return;
    try {
        setIsLoading(true);
        const data = await getReimbursementFinance(user.tk);
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

const openAction = (id, type) => {
    setModalState({ isOpen: true, type, requestId: id });
  };

  const handleConfirmAction = async (id, action, comment) => {
    if (!user?.tk) return;
    try {
        setIsSubmitting(true);
        await patchReimbursementStatus(id, action, comment, user.tk);
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
          {isLoading ? (
             <div className="p-8 text-center text-muted-foreground">Loading requests...</div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests?.map((req) => (
                <TableRow 
                    key={req.id} 
                    className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => setActiveRequest(req)}
                >
                  <TableCell className="font-medium">{req.id ? req.id.substring(0, 8) + '...' : '-'}</TableCell>
                  <TableCell>
                    <div className="font-semibold">{req.title}</div>
                  </TableCell>
                  <TableCell>{req.userFullName || req.userEmployeeId}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                      req.totalAmount || 0
                    )}
                  </TableCell>
                  <TableCell>{req.updatedAt ? format(new Date(req.updatedAt), 'dd MMM yyyy HH:mm') : '-'}</TableCell>
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
            <SheetDescription>
              View the details of the reimbursement request.
            </SheetDescription>
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
