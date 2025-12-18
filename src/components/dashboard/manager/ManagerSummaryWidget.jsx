import React, { useEffect, useState } from 'react';
import {
  BanknoteArrowUp,
  PiggyBank,
  Loader2,
  History,
  CheckCircle,
  XCircle,
  Plane,
  CheckCircle2,
} from 'lucide-react';
import { Clock, Wallet } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/AuthContext';
import getReimbursementFinance from '@/api/reimbursement/getReimbursementFinance';
import getTripFinance from '@/api/trip/getTripFinance';
import { router } from '@/router';
import getReimbursementManager from '@/api/reimbursement/getReimbursementManager';
import getTripManager from '@/api/trip/getTripManager';

export default function ManagerSummaryWidget() {
  const { user } = useAuth();
  const [managerStats, setManagerStats] = useState({
    pendingApproval: 0,
    TripFinanceApproved: 0,
    TripOngoing: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.tk) return;
      setLoading(true);
      try {
        const [reimbursementData, tripData] = await Promise.all([
          getReimbursementManager(user.tk),
          getTripManager(user.tk),
        ]);
        const financeApproved =
          tripData?.filter((t) => t.status === 'Finance Approved')?.length || 0;
        const ongoing = tripData?.filter((t) => t.status === 'Ongoing')?.length || 0;

        setManagerStats({
          pendingApproval: reimbursementData?.length || 0,
          TripFinanceApproved: financeApproved,
          TripOngoing: ongoing,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.tk]);

  const reimbursementClick = () => router.navigate({ to: '/approval/manager' });
  const tripClick = () => router.navigate({ to: '/trip/' });

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Reimbursement Pending Approval */}
      <Card
        onClick={reimbursementClick}
        className="cursor-pointer hover:bg-slate-50 transition-colors rounded-lg shadow-sm border-l-4 border-l-amber-500"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
          <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
            Pending Approval
          </CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="text-2xl font-black">{managerStats.pendingApproval}</div>
          <p className="text-[10px] text-muted-foreground truncate font-medium">Items to review</p>
        </CardContent>
      </Card>

      {/* 2. Ongoing Trips */}
      <Card
        onClick={tripClick}
        className="cursor-pointer hover:bg-slate-50 transition-colors rounded-lg shadow-sm border-l-4 border-l-blue-500"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
          <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
            Ongoing Trips
          </CardTitle>
          <Plane className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="text-2xl font-black">{managerStats.TripOngoing}</div>
          <p className="text-[10px] text-muted-foreground truncate font-medium">
            Active business travel
          </p>
        </CardContent>
      </Card>

      {/* 3. Finance Approved Trips */}
      <Card
        onClick={tripClick}
        className="cursor-pointer hover:bg-slate-50 transition-colors rounded-lg shadow-sm border-l-4 border-l-green-500"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
          <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
            Finance Approved
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="text-2xl font-black">{managerStats.TripFinanceApproved}</div>
          <p className="text-[10px] text-muted-foreground truncate font-medium">
            Ready for next steps
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
