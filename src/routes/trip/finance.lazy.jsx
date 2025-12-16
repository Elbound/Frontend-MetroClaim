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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const Route = createLazyFileRoute('/trip/finance')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isFinance } = useAuth();

  const [modalState, setModalState] = useState({ isOpen: false, type: null, requestId: null });

  // --- 1. REVISED MOCK DATA STRUCTURE ---
  const requests = [
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      title: 'Jakarta Sales Pitch',
      description: 'Meeting with prospective clients in Central Jakarta.',
      start_date: '2025-12-20',
      end_date: '2025-12-23',
      destination: 'Jakarta, Indonesia',
      totalAmount: 500000,
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Jane Smith',
      title: 'Bandung Tech Conference',
      description: 'Attending "Future of AI" conference and networking event.',
      start_date: '2026-01-10',
      end_date: '2026-01-12',
      destination: 'Bandung, Indonesia',
      totalAmount: 200000,
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'Bob Johnson',
      title: 'Surabaya Office Audit',
      description: 'Internal financial audit for the regional branch office.',
      start_date: '2026-02-05',
      end_date: '2026-02-05',
      destination: 'Surabaya, Indonesia',
      totalAmount: 300000,
    },
  ];
  // ----------------------------------------

  const openAction = (id, type) => {
    setModalState({ isOpen: true, type, requestId: id });
  };
  
  const handleConfirmAction = (requestId, actionType, cost, comment) => {
    console.log(`Confirmed Action: Request ID ${requestId}, Type: ${actionType}, Cost: ${cost}, Comment: "${comment}"`);
    setModalState({ isOpen: false, type: null, requestId: null });
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
                <TableHead>Actions</TableHead>
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
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 p-2 bg-blue-600 hover:bg-blue-700"
                        onClick={() => openAction(req.id, 0)}
                        title="Set Approved Cost"
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Set Cost
                      </Button>
                    </div>
                  </TableCell>
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
      onConfirm(requestId, actionType, finalCost, comment);
    } else {
      onConfirm(requestId, actionType, null, comment); 
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