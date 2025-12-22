import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BanknoteArrowUp, PiggyBank, Loader2, History, CheckCircle, XCircle } from 'lucide-react';
import userService from '@/services/userService';
import reimbursementService from '@/services/reimbursementService';
import getUserData from '@/api/getUserData';
import getReimbursementMe from '@/api/reimbursement/getReimbursementMe';
import { useAuth } from '@/hooks/AuthContext';

export default function SummaryWidget() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [reimbursementStats, setReimbursementStats] = useState({
    lastAmount: 0,
    lastApprovedAmount: 0,
    lastRejectedAmount: 0,
  });
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.tk) return;
      setLoading(true);
      try {
        const [userData, reimbursements] = await Promise.all([
          getUserData(user.tk),
          getReimbursementMe(user.tk)
        ]);
        
        setData(userData);

        if (reimbursements && Array.isArray(reimbursements)) {
          // Sort by date descending (newest first)
          const sorted = [...reimbursements].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          const lastReimb = sorted[0];
          const lastApproved = sorted.find(r => r.status === 'Approved');
          const lastRejected = sorted.find(r => r.status === 'Rejected');

          setReimbursementStats({
            lastAmount: lastReimb ? lastReimb.totalAmount : 0,
            lastApprovedAmount: lastApproved ? lastApproved.totalAmount : 0,
            lastRejectedAmount: lastRejected ? lastRejected.totalAmount : 0,
          });
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.tk]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="py-6 flex justify-center">
            <Loader2 className="animate-spin text-gray-400" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
             <Card key={i}>
              <CardContent className="py-6 flex justify-center">
                <Loader2 className="animate-spin text-gray-400 h-4 w-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="h-full flex flex-col justify-center">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unpaid Approved Reimbursement</CardTitle>
          <PiggyBank className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data?.dueReimbursement || 0)}</div>
          <p className="text-xs text-muted-foreground">Waiting for payment</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-[10px] font-medium uppercase text-muted-foreground truncate" title="Last Submission">Last Submit</CardTitle>
            <History className="h-3 w-3 text-blue-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-sm font-bold truncate" title={formatCurrency(reimbursementStats.lastAmount)}>
              {formatCurrency(reimbursementStats.lastAmount)}
            </div>
            <p className="text-[10px] text-muted-foreground truncate">Recently Submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-[10px] font-medium uppercase text-muted-foreground truncate" title="Last Approved">Last Approved</CardTitle>
            <CheckCircle className="h-3 w-3 text-green-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-sm font-bold truncate" title={formatCurrency(reimbursementStats.lastApprovedAmount)}>
              {formatCurrency(reimbursementStats.lastApprovedAmount)}
            </div>
             <p className="text-[10px] text-muted-foreground truncate">Finance Approved</p>
          </CardContent>
        </Card>

         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
             <CardTitle className="text-[10px] font-medium uppercase text-muted-foreground truncate" title="Last Rejected">Last Rejected</CardTitle>
             <XCircle className="h-3 w-3 text-red-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-sm font-bold truncate" title={formatCurrency(reimbursementStats.lastRejectedAmount)}>
              {formatCurrency(reimbursementStats.lastRejectedAmount)}
            </div>
             <p className="text-[10px] text-muted-foreground truncate">Recently Rejected</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
