import { createLazyFileRoute } from '@tanstack/react-router';
import { useAuth } from '../../hooks/AuthContext';
import { router } from '../../router';
import ReimbursementList from '../../components/ReimbursementList';
import { Check, RotateCcw, X } from 'lucide-react';
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

export const Route = createLazyFileRoute('/approval/finance')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isFinance } = useAuth();

  const [modalState, setModalState] = useState({ isOpen: false, type: null, requestId: null });

  // Mock data \
  const requests = [
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      title: 'Travel Expense',
      description: 'Business trip to Jakarta',
      totalAmount: 500,
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Jane Smith',
      title: 'Office Supplies',
      description: 'Purchased stationery and office materials',
      totalAmount: 200,
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'Bob Johnson',
      title: 'Conference Fee',
      description: 'Registration for tech conference',
      totalAmount: 300,
    },
  ];

  const openAction = (id, type) => {
    setModalState({ isOpen: true, type, requestId: id });
  };

  return (
    <div className="mx-6 mt-5 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Pending Approvals</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests?.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">
                    {req.employeeName || req.employeeId}
                  </TableCell>
                  <TableCell>
                    <div>{req.title}</div>
                    <div className="text-xs text-gray-500 truncate w-48">{req.description}</div>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                      req.totalAmount || 0
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                        onClick={() => openAction(req.id, 0)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={() => openAction(req.id, 1)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!requests ||
                (requests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
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
        // onConfirm={(id, action, comment) => processMutation.mutate({ id, action, comment })}
      />
    </div>
  );
}

const ActionModal = ({ isOpen, onClose, actionType, requestId, onConfirm }) => {
  const [comment, setComment] = useState('');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg animate-in fade-in zoom-in-95">
        <h3 className="text-lg font-semibold mb-2">
          {actionType === 0
            ? 'Approve Request?'
            : actionType === 1
              ? 'Reject Request'
              : 'Request Revision'}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {actionType === 0
            ? 'Are you sure you want to approve this request?'
            : 'Please provide a reason.'}
        </p>

        {(actionType === 1 || actionType === 2) && (
          <textarea
            className="w-full border rounded-md p-2 text-sm mb-4"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={actionType === 1 ? 'destructive' : 'default'}
            onClick={() => onConfirm(requestId, actionType, comment)}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};
