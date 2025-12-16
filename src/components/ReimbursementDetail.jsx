import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FileText, History } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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
    const navigate = useNavigate();
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    if (!detailData) {
        return <p className="p-4 text-center text-muted-foreground">Error loading request details.</p>;
    }

    const handleViewReceipt = (receiptBase64) => {
        // Construct the full Base64 string if it's just the raw data
        const imgSrc = receiptBase64.startsWith('data:image') 
            ? receiptBase64 
            : `data:image/jpeg;base64,${receiptBase64}`;
            
        setSelectedReceipt(imgSrc);
    };

    return (
        <>
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

                    {/* Actions */}
                    {(() => {
                        const sortedLogs = detailData.logs ? [...detailData.logs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
                        const latestAction = sortedLogs.length > 0 ? sortedLogs[0].action : detailData.status;
                        
                        if (latestAction === 'Draft' || latestAction === 'ManagerRevision') {
                             return (
                                <div className="flex justify-end pt-2">
                                    <Button 
                                        onClick={() => navigate({ to: '/reimbursement/update', search: { id: detailData.id } })}
                                        className="w-full sm:w-auto"
                                    >
                                        Update Request
                                    </Button>
                                </div>
                            );
                        }
                        return null;
                    })()}

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

            <Dialog open={!!selectedReceipt} onOpenChange={(open) => !open && setSelectedReceipt(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Receipt View</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-slate-50 rounded-md">
                        {selectedReceipt && (
                            <img 
                                src={selectedReceipt} 
                                alt="Receipt" 
                                className="max-w-full max-h-full object-contain shadow-sm" 
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
