import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { Calendar, CreditCard } from 'lucide-react';

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

export const getLatestAction = (request) => {
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
    <>
      {/* Desktop View */}
      <div className="hidden md:block rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-100/60 border-b border-gray-100">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="w-[15%] uppercase text-[11px] font-bold text-gray-500 tracking-wider h-12 pl-6">Reference ID</TableHead>
              <TableHead className="w-[35%] uppercase text-[11px] font-bold text-gray-500 tracking-wider h-12">Title</TableHead>
              <TableHead className="w-[20%] uppercase text-[11px] font-bold text-gray-500 tracking-wider h-12">Date</TableHead>
              <TableHead className="w-[15%] uppercase text-[11px] font-bold text-gray-500 tracking-wider h-12">Amount</TableHead>
              <TableHead className="w-[15%] uppercase text-[11px] font-bold text-gray-500 tracking-wider h-12 pr-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((request) => {
              const actionStatus = getLatestAction(request);
              return (
                  <TableRow 
                      key={request.id} 
                      className="cursor-pointer hover:bg-blue-50/50 border-b border-gray-50 last:border-none transition-colors"
                      onClick={() => onRowClick(request.id)}
                  >
                    <TableCell className="py-4 pl-6">
                      <span className="font-mono text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {request.id.substring(0, 8)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                        <span className="font-semibold text-gray-700 block max-w-[250px] truncate">
                          {request.title}
                        </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm text-gray-500">
                        {request.updatedAt ? format(new Date(request.updatedAt), 'dd MMM yyyy HH:mm') : '-'}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-medium text-gray-900">
                        {formatCurrency(request.totalAmount)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 pr-6">
                      <Badge variant={getStatusVariant(actionStatus)} className="rounded-full shadow-none font-medium px-3 uppercase text-[10px] tracking-wide">
                        {actionStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {items.map((request) => {
           const actionStatus = getLatestAction(request);
           return (
             <Card 
                key={request.id} 
                onClick={() => onRowClick(request.id)}
                className="active:scale-[0.98] transition-transform border-gray-100 shadow-sm"
             >
                <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                        <span className="font-mono text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                           #{request.id.substring(0, 8)}
                        </span>
                        <Badge variant={getStatusVariant(actionStatus)} className="rounded-full shadow-none font-medium px-2 py-0.5 uppercase text-[10px] tracking-wide">
                           {actionStatus}
                        </Badge>
                    </div>
                    
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm line-clamp-2">{request.title}</h3>
                    </div>

                    <div className="flex justify-between items-end pt-1">
                        <div className="flex flex-col gap-1">
                             <div className="flex items-center text-xs text-gray-400">
                                <Calendar className="w-3 h-3 mr-1" />
                                {request.updatedAt ? format(new Date(request.updatedAt), 'dd MMM yyyy') : '-'}
                             </div>
                        </div>
                         <div className="text-right">
                             <span className="block text-[10px] text-gray-400 font-medium uppercase tracking-wider">Total</span>
                             <span className="font-bold text-[#003366] text-sm">
                                {formatCurrency(request.totalAmount)}
                             </span>
                        </div>
                    </div>
                </CardContent>
             </Card>
           )
        })}
      </div>
    </>
  );
}
