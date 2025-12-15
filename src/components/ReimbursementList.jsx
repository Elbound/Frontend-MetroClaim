import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, 
  }).format(amount);


const getStatusVariant = (status) => {
  switch (status) {

    case 'Approved':
    case 'ManagerApproved':
    case 'FinanceApproved':
      return 'default'; // Blue/Primary
    case 'Rejected':
    case 'Revise':
      return 'destructive'; // Red
    case 'Pending':
    case 'Submitted':
      return 'secondary'; // Gray
    case 'paid':
      return 'default'; // Use 'default' for paid
    case 'rejected':
      return 'destructive'; // Use 'destructive' for rejected
    case 'pending':
      return 'secondary'; // Use 'secondary' for pending
    default:
      return 'outline';
  }
};


export default function ReimbursementList({ items, onRowClick }) {
  return (
    <div className="space-y-3 p-4">
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No requests found</p>
        </div>
      ) : (
        items.map((request) => (
          <Card
            key={request.id}
            className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-primary/50"
            onClick={() => onRowClick(request.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                {/* Left Section: Title, Requestor, Date */}
                <div className="min-w-0 pr-4 flex-1">
                  <p className="font-semibold text-gray-900 truncate">{request.title}</p>
                  <p className="text-gray-600 text-sm mt-0.5">
                    {request.requestorName} • ID: {request.id}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {request.date ? format(new Date(request.date), 'dd MMM yyyy') : '-'}
                  </p>
                </div>

                {/* Right Section: Amount and Status */}
                <div className="flex flex-col items-end space-y-2 min-w-[150px]">
                  <p className="font-bold text-lg text-primary">{formatCurrency(request.amount)}</p>
                  <Badge variant={getStatusVariant(request.status)}>{request.status}</Badge>
                </div>

                {/* Click Indicator */}
                <ArrowRight className="h-5 w-5 ml-4 text-muted-foreground hidden sm:block" />
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
