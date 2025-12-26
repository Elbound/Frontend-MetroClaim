import React, { useEffect, useState } from 'react';
import { BanknoteArrowUp, PiggyBank, Loader2, History, CheckCircle, XCircle } from 'lucide-react';
import { Clock, Wallet } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/AuthContext';
import getReimbursementFinance from '@/api/reimbursement/getReimbursementFinance';
import getTripFinance from '@/api/trip/getTripFinance';
import { router } from '@/router';

export default function FinanceSummaryWidget({ statData, summaryLoading }) {
  const { user } = useAuth();
  // const [financeStats, setFinanceStats] = useState({
  //   pendingApproval: 0,
  //   pendingTripCost: 0,
  // });
  // const [loading, setLoading] = useState(true);

  const financeStats = statData;
  const loading = summaryLoading;

  const reimbursementclick = () => {
    router.navigate({
      to: '/approval/finance',
    });
  };
  const tripClick = () => {
    router.navigate({
      to: '/trip/finance',
    });
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          onClick={reimbursementclick}
          className="cursor-pointer hover:bg-gray-100 transition-colors rounded-lg shadow-sm"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle
              className="text-[10px] font-medium uppercase text-muted-foreground truncate"
              title="Pending Reimbursements"
            >
              Pending Approval
            </CardTitle>
            <Clock className="h-3 w-3 text-amber-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-xl font-bold">{financeStats.pendingApproval}</div>
            <p className="text-[10px] text-muted-foreground truncate">Reimbursements to review</p>
          </CardContent>
        </Card>

        {/* Pending Trip Costs Card */}
        <Card
          onClick={tripClick}
          className="cursor-pointer hover:bg-gray-100 transition-colors rounded-lg shadow-sm"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle
              className="text-[10px] font-medium uppercase text-muted-foreground truncate"
              title="Pending Trip Costs"
            >
              Pending Trip Cost
            </CardTitle>
            <Wallet className="h-3 w-3 text-blue-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-xl font-bold">{financeStats.pendingTripCost}</div>
            <p className="text-[10px] text-muted-foreground truncate">Awaiting cost finalization</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
