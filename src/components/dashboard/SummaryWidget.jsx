import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BanknoteArrowUp, PiggyBank, Loader2 } from 'lucide-react';
import userService from '@/services/userService';
import reimbursementService from '@/services/reimbursementService';
import getUserData from '@/api/getUserData';
import { useAuth } from '@/hooks/AuthContext';

export default function SummaryWidget() {
  const { user } = useAuth();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getUserData(user.tk);
      setData(response);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <Card>
          <CardContent className="py-6 flex justify-center">
            <Loader2 className="animate-spin text-gray-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6 flex justify-center">
            <Loader2 className="animate-spin text-gray-400" />
          </CardContent>
        </Card>
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
          <p className="text-xs text-muted-foreground">Waiting for payment</p>
        </CardContent>
      </Card>
    </div>
  );
}
