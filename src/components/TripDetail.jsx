import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Loader2, User } from 'lucide-react';
import getTripById from '@/api/trip/getTripById';
import { useAuth } from '../hooks/AuthContext';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TripDetail({ tripId, onClose }) {
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchTrip();
  }, [tripId, user?.tk]);

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

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 space-y-6 pr-6 pb-6 pt-2">
        {/* Header Section */}
        <div className="space-y-1">
          <Badge variant="outline" className={`mb-2 ${getStatusColor(trip.status)}`}>
            {trip.status}
          </Badge>
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
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(trip.cost)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Start Date</p>
            <p className="font-medium text-gray-900">{format(new Date(trip.startDate), 'dd MMM yyyy')}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">End Date</p>
            <p className="font-medium text-gray-900">{format(new Date(trip.endDate), 'dd MMM yyyy')}</p>
          </div>
             <div>
            <p className="text-gray-500 text-xs">Manager</p>
            <p className="font-medium text-gray-900">{trip.managerName}</p>
          </div>
        </div>

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
                                <Badge variant="secondary" className="text-xs font-normal">
                                    {p.reimbursementStatus}
                                </Badge>
                            </td>
                            <td className="p-3 text-right text-gray-700">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(p.currentAmount)}
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'ongoing': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'completed': return 'bg-green-50 text-green-700 border-green-200';
    case 'planned': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}
