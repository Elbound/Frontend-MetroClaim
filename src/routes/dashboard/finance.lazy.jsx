import getReimbursementFinance from '@/api/reimbursement/getReimbursementFinance';
import getReimbursementFinanceHistory from '@/api/reimbursement/getReimbursementFinanceHistory';
import getTripFinance from '@/api/trip/getTripFinance';
import getUsers from '@/api/user/getUsers';
import FinanceBarDataWidget from '@/components/dashboard/finance/FinanceBarDataWidget';
import FinanceSummaryWidget from '@/components/dashboard/finance/FinanceSummaryWidget';
import { PaydayWidget } from '@/components/dashboard/finance/PaydayWidget';
import { useAuth } from '@/hooks/AuthContext';
import { router } from '@/router';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createLazyFileRoute('/dashboard/finance')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isFinance, user } = useAuth();

  const [history, setHistory] = useState([]);
  const [financeStats, setFinanceStats] = useState({
    pendingApproval: 0,
    pendingTripCost: 0,
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistoryData = async () => {
    setLoading(true);
    const data = await getReimbursementFinanceHistory(user?.tk);
    setHistory(data);
  };

  const fetchData = async () => {
    const [reimbursementData, tripData] = await Promise.all([
      getReimbursementFinance(user.tk),
      getTripFinance(user.tk),
    ]);

    setFinanceStats({
      pendingApproval: reimbursementData?.length || 0,
      pendingTripCost: tripData?.length || 0,
    });
  };

  const fetchUserData = async () => {
    setLoading(true);
    const userData = await getUsers(user?.tk);
    setEmployees(userData);
  };

  useEffect(() => {
    if (!user?.tk) return;
    setLoading(true);
    try {
      fetchHistoryData();
      fetchData();
      fetchUserData();
    } catch (error) {
      router.navigate({
        to: '/error',
        replace: true,
        search: {
          status: error.status || 500,
          msg: error.message || 'An unexpected error occurred.',
        },
      });
    } finally {
      setLoading(false);
    }
  }, []);

  if (!isFinance) {
    router.navigate({
      to: '/login',
      search: {
        status: 403,
        msg: 'Need Finance Role',
      },
    });
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mt-2">
        <FinanceSummaryWidget statData={financeStats} summaryLoading={loading} />
      </div>
      <div className="mt-8">
        <PaydayWidget employeesData={employees} paydayLoading={loading} />
      </div>
      <div className="mt-6">
        <FinanceBarDataWidget historyData={history} barDataLoading={loading} />
      </div>
      {/* <div className="mt-4">placeholder</div> */}
    </div>
  );
}
