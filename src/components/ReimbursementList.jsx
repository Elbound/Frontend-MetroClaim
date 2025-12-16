import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, 
  }).format(amount);

const getStatusVariant = (status) => {
  switch (status) {
    case 'Approved':
    case 'FinanceApproved':
    case 'ManagerApproved':
    case 'paid':
      return 'default'; // Blue/Primary
    case 'Rejected':
    case 'Revise':
    case 'ManagerRevision':
    case 'rejected':
      return 'destructive'; // Red
    case 'Pending':
    case 'Submitted':
    case 'pending':
      return 'secondary'; // Gray
    default:
      return 'outline';
  }
};

const getLatestAction = (request) => {
    if (request.logs && request.logs.length > 0) {
        // Sort by createdAt descending to ensure we get the absolute latest
        const sortedLogs = [...request.logs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return sortedLogs[0].action;
    }
    return request.status;
}

export default function ReimbursementList({ items, onRowClick }) {
  if (items.length === 0) {
    return (
        <div className="text-center py-8 text-gray-500">
          <p>No requests found</p>
        </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Reference ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((request) => {
            const actionStatus = getLatestAction(request);
            return (
                <TableRow 
                    key={request.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onRowClick(request.id)}
                >
                  <TableCell className="font-medium truncate max-w-[150px] py-4" title={request.id}>
                    {request.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium py-4">
                      {request.title}
                  </TableCell>
                  <TableCell className="py-4">
                    {request.updatedAt ? format(new Date(request.updatedAt), 'dd MMM yyyy HH:mm') : '-'}
                  </TableCell>
                  <TableCell className="py-4">
                    {formatCurrency(request.totalAmount)}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant={getStatusVariant(actionStatus)}>{actionStatus}</Badge>
                  </TableCell>
                </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
