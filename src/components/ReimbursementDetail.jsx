import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FileText, History } from 'lucide-react';
import { format } from 'date-fns';

// Helper function from your original code
const getStatusVariant = (status) => {
    switch(status) {
        case 'Approved': case 'ManagerApproved': case 'FinanceApproved': return 'default';
        case 'Rejected': case 'Revise': return 'destructive';
        case 'Pending': case 'Submitted': return 'secondary';
        default: return 'outline';
    }
};

export default function ReimbursementDetail({ detailData, onClose, userRole }) {
    if (!detailData) {
        return <p className="p-4 text-center text-muted-foreground">Error loading request details.</p>;
    }

    // Mock functions for actions (not implemented yet, just for structure)
    const handleViewReceipt = (receiptUrl) => {
        alert(`Would open modal for receipt: ${receiptUrl}`);
    };

    return (
        <ScrollArea className="flex-1 px-4 mt-4 w-full [&>[data-slot=scroll-area-viewport]]:overflow-x-hidden">
            <div className="space-y-6 pb-6">
                
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground">Reference ID</label>
                        <p className="font-semibold text-sm">{detailData.id}</p>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground">Total Amount</label>
                        <p className="font-bold text-xl text-primary">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(detailData.totalAmount)}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground">Status</label>
                        <div className="mt-1"><Badge variant={getStatusVariant(detailData.status)}>{detailData.status}</Badge></div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground">Category</label>
                        <p>{detailData.categoryName}</p>
                    </div>
                    <div className="col-span-2">
                        <label className="text-xs font-medium text-muted-foreground">Description</label>
                        <p className="text-sm text-gray-700">{detailData.description || "No description provided."}</p>
                    </div>
                    {/* Simplified employee info, assuming this view is for all users */}
                    <div className="col-span-2">
                        <label className="text-xs font-medium text-muted-foreground">Submitted By</label>
                        <p className="text-sm font-medium">{detailData.userFullName}</p>
                    </div>
                </div>

                {/* NOTE: Edit and Approval buttons would go here. They are omitted for this mock version. */}
                <Separator />
                
                {/* Items Section */}
                <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center"><FileText className="w-4 h-4 mr-2"/> Expense Items</h4>
                    <div className="space-y-3">
                        {detailData.items?.map((item, index) => (
                            <div key={item.id} className="border rounded-lg p-3 text-sm bg-muted/20">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-gray-900">{format(new Date(item.dateOfExpense), "dd MMM yyyy")}</span>
                                    <span className="font-bold">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.amount)}
                                    </span>
                                </div>
                                {item.receipt && (
                                    <div className="mt-2">
                                        <span 
                                            className="text-xs text-blue-600 underline cursor-pointer hover:text-blue-800" 
                                            onClick={() => handleViewReceipt(item.receipt)}
                                        >
                                            View Receipt
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                <Separator />

                {/* Logs Section */}
                <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center"><History className="w-4 h-4 mr-2"/> Status History</h4>
                    <ol className="relative border-l border-gray-200 ml-2"> 
                        {/* Sort logs by newest first for timeline view */}
                        {detailData.logs?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((log) => (
                            <li key={log.id} className="mb-6 ml-4">
                                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                                <time className="mb-1 text-xs font-normal leading-none text-gray-400">
                                    {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm")}
                                </time>
                                <h3 className="text-sm font-semibold text-gray-900">
                                    {log.action} <span className="text-muted-foreground font-normal">by {log.approverName || "System"}</span>
                                </h3>
                                {log.comment && <p className="mb-4 text-sm font-normal text-gray-500 italic">"{log.comment}"</p>}
                            </li>
                        ))}
                    </ol>
                </div>
                
            </div>
        </ScrollArea>
    );
}