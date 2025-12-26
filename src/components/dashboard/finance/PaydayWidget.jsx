import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Users, ReceiptText } from 'lucide-react';
import getUsers from '@/api/user/getUsers';
import { useAuth } from '@/hooks/AuthContext';
import { router } from '@/router';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export function PaydayWidget({ employeesData, paydayLoading }) {
  const { user } = useAuth();
  // const [employees, setEmployees] = useState([]);
  // const [loading, setLoading] = useState(false);

  // fetch data========
  const employees = employeesData;
  const loading = paydayLoading;

  //===================

  const totalDue = useMemo(() => {
    return employees.reduce((sum, emp) => sum + (emp.dueReimbursement || 0), 0);
  }, [employees]);

  if (loading) return <div className="h-[200px] animate-pulse bg-muted rounded-xl" />;

  return (
    <Card className="overflow-hidden border-none bg-linear-to-br from-slate-50 to-slate-100 shadow-lg dark:from-slate-900 dark:to-slate-950">
      <div className="flex flex-col sm:flex-row">
        <div className="flex-1 p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Outstanding Liability
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <h2 className="text-4xl font-black tracking-tighter text-foreground">
              {formatCurrency(totalDue).replace('Rp', '')}
            </h2>
            <span className="text-sm font-bold text-muted-foreground">IDR</span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground italic">
            {totalDue > 0 ? 'Funds ready for payroll disbursement' : 'No pending approvals to pay'}
          </p>
        </div>

        <div className="bg-slate-200/50 dark:bg-slate-800/50 p-4 flex items-center justify-center min-w-[180px]">
          <Button
            onClick={() => router.navigate({ to: '/salary' })}
            disabled={totalDue <= 0}
            className={`
          group relative w-full h-full min-h-[60px] flex-col gap-1 px-6 
          transition-all duration-300
          ${
            totalDue > 0
              ? 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-green-500/20'
              : 'grayscale'
          }
        `}
          >
            <span className="text-xs font-bold uppercase">Disburse</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] opacity-80">Go to Salary</span>
              <Coins className="h-3 w-3 transition-transform group-hover:rotate-12" />
            </div>
          </Button>
        </div>
      </div>
    </Card>
  );
}
