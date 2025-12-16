
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BanknoteArrowUp, PiggyBank, Loader2 } from 'lucide-react';
import userService from '@/services/userService';
import reimbursementService from '@/services/reimbursementService';

export default function SummaryWidget() {
  const [data, setData] = useState({
      dueReimbursement: 0,
      lastPaid: 0
  });
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  useEffect(() => {
      const fetchData = async () => {
          try {
              const [userData, claims] = await Promise.all([
                  userService.getMe(),
                  reimbursementService.getMyReimbursements()
              ]);

              const due = userData?.dueReimbursement || 0;

              const approvedClaims = claims.filter(c => 
                  c.status === 'FinanceApproved' || c.status === 'ManagerApproved' || c.status === 'Approved'
              );
              
              const lastPaidAmount = approvedClaims.length > 0 ? (approvedClaims[0].totalAmount || 0) : 0;

              setData({
                  dueReimbursement: due,
                  lastPaid: lastPaidAmount
              });

          } catch (e) {
              console.error("Failed to fetch summary data", e);
          } finally {
              setLoading(false);
          }
      };
      
      fetchData();
  }, []);

  if (loading) {
      return (
        <>
            <Card><CardContent className="py-6 flex justify-center"><Loader2 className="animate-spin text-gray-400"/></CardContent></Card>
            <Card><CardContent className="py-6 flex justify-center"><Loader2 className="animate-spin text-gray-400"/></CardContent></Card>
        </>
      );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Due Reimbursement</CardTitle>
          <PiggyBank className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data.dueReimbursement)}</div>
          <p className="text-xs text-muted-foreground">
            Waiting for payment
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Paid</CardTitle>
          <BanknoteArrowUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data.lastPaid)}</div>
          <p className="text-xs text-muted-foreground">
            Latest approved claim
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
