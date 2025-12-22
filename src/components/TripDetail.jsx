import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, User, Check, X, AlertCircle, DollarSign } from 'lucide-react';
import getTripById from '@/api/trip/getTripById';
import postTripPublish from '@/api/trip/postTripPublish';
import putTripCancel from '@/api/trip/putTripCancel';
import putTripClose from '@/api/trip/putTripClose';
import { useAuth } from '../hooks/AuthContext';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { router } from '@/router';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import StatusBadge from './ui/StatusBadge';

export default function TripDetail({ tripId, onClose, onAction, readOnly }) {
  const { user, isFinance } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null); // 'confirm' | 'cancel' | 'close' | null

  // console.log(tripId)

  const fetchTrip = async () => {
    if (!tripId || !user?.tk) return;
    setLoading(true);
    try {
      const data = await getTripById(tripId, user.tk);
      setTrip(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [tripId, user?.tk]);

  const requestAction = (action) => {
    setConfirmationAction(action);
  };

  const executeAction = async () => {
    if (!user?.tk || !confirmationAction) return;
    setIsSubmitting(true);
    try {
      if (confirmationAction === 'confirm') {
        await postTripPublish(tripId, user.tk);
        toast.success('Trip confirmed successfully');
      } else if (confirmationAction === 'cancel') {
        await putTripCancel(tripId, user.tk);
        toast.success('Trip cancelled successfully');
      } else if (confirmationAction === 'close') {
        await putTripClose(tripId, user.tk);
        toast.success('Trip closed successfully');
      }
      setConfirmationAction(null);
      await fetchTrip();
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

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-red-500">
        <p>Error loading trip details.</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!trip) return null;

  const getConfirmationText = () => {
      switch(confirmationAction) {
          case 'confirm': return { title: 'Confirm Trip?', desc: 'Are you sure you want to publish this trip? This action cannot be undone.', btn: 'Yes, Confirm' };
          case 'cancel': return { title: 'Cancel Trip?', desc: 'Are you sure you want to cancel this trip? This action cannot be undone.', btn: 'Yes, Cancel' };
          case 'close': return { title: 'Close Trip?', desc: 'Are you sure you want to close this trip? This indicates the trip is finished.', btn: 'Yes, Close' };
          default: return { title: 'Confirm?', desc: 'Are you sure?', btn: 'Yes' };
      }
  }

  const confirmUI = getConfirmationText();

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 space-y-6 pr-6 pb-6 pt-2 overflow-y-auto">
        {/* Header Section */}
        <div className="space-y-1">
          <StatusBadge status={trip.status}/>
          {/* <Badge variant="outline" className={`mb-2 ${getStatusColor(trip.status)}`}>
            {trip.status}
          </Badge> */}
          <h2 className="text-2xl font-bold text-gray-900">{trip.title || 'Untitled Trip'}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            Created on {format(new Date(trip.createdAt), 'dd MMM yyyy, HH:mm')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Destination</p>
            <p className="font-medium text-gray-900">{trip.destination}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Cost</p>
            <p className="font-medium text-gray-900">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                trip.cost
              )}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Start Date</p>
            <p className="font-medium text-gray-900">
              {format(new Date(trip.startDate), 'dd MMM yyyy')}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">End Date</p>
            <p className="font-medium text-gray-900">
              {format(new Date(trip.endDate), 'dd MMM yyyy')}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Manager</p>
            <p className="font-medium text-gray-900">{trip.managerName}</p>
          </div>
        </div>

        {!readOnly && isFinance && (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="default"
              className="h-8 p-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => onAction(0)}
              title="Set Approved Cost"
            >
              <DollarSign className="w-4 h-4 mr-1" />
              Set Cost
            </Button>
          </div>
        )}

        <Separator />

        <div>
          <p className="text-gray-500 text-xs mb-1">Description</p>
          <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 whitespace-pre-wrap">
            {trip.description || 'No description provided.'}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <User className="w-4 h-4 mr-2" /> Participants
          </h3>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {trip.participants.map((p) => (
                  <tr key={p.userId}>
                    <td className="p-3 font-medium text-gray-900">{p.fullName}</td>
                    <td className="p-3">
                      <StatusBadge status={p.reimbursementStatus}/>
                      {/* <Badge variant="secondary" className="text-xs font-normal">
                        {p.reimbursementStatus}
                      </Badge> */}
                    </td>
                    <td className="p-3 text-right text-gray-700">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      }).format(p.currentAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Buttons for FinanceApproved */}
      {!readOnly && trip.status === 'FinanceApproved' && (
        <div className="border-t p-4 flex justify-end gap-3 bg-white mt-auto sticky bottom-0">
          <Button
            variant="destructive"
            onClick={() => requestAction('cancel')}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <X className="w-4 h-4 mr-2" />
            )}
            Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => requestAction('confirm')}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Confirm
          </Button>
        </div>
      )}

      {/* Buttons for Ongoing */}
      {!readOnly && trip.status === 'Ongoing' && (
        <div className="border-t p-4 flex justify-end gap-3 bg-white mt-auto sticky bottom-0">
          <Button
            className="bg-slate-900 hover:bg-slate-800 text-white"
            onClick={() => requestAction('close')}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Close Trip
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={!!confirmationAction}
        onOpenChange={(open) => !open && !isSubmitting && setConfirmationAction(null)}
      >
        <DialogContent className="sm:max-w-md z-[110]">
          <DialogHeader>
            <DialogTitle>
              {confirmUI.title}
            </DialogTitle>
            <DialogDescription>
              {confirmUI.desc}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setConfirmationAction(null)}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              variant={confirmationAction === 'cancel' ? 'destructive' : 'default'}
              onClick={executeAction}
              disabled={isSubmitting}
              className={confirmationAction === 'confirm' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {confirmUI.btn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'ongoing':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'completed':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'planned':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}
