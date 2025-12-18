import React, { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/AuthContext';
import getReimbursementFinanceHistory from '@/api/reimbursement/getReimbursementFinanceHistory';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function FinanceBarDataWidget() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setLoading(true);
        const data = await getReimbursementFinanceHistory(user?.tk);
        setHistory(data);
      } catch (error) {
        console.error('Chart Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.tk) fetchHistoryData();
  }, [user?.tk]);

  const chartData = useMemo(() => {
    const categories = {};

    history
      .filter((item) => item.status === 'Pending' || item.status === 'Approved')
      .forEach((item) => {
        const cat = item.categoryName || 'Uncategorized';
        categories[cat] = (categories[cat] || 0) + item.totalAmount;
      });

    return Object.entries(categories)
      .map(([name, total]) => ({
        category: name,
        amount: total,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [history]);

  const chartConfig = {
    amount: {
      label: 'Liability',
      color: 'oklch(var(--p))',
    },
  };

  if (loading) {
    return (
      <Card className="h-[350px] flex items-center justify-center border-dashed">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Analyzing categories...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[350px]">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-bold">Reimbursement Cost by Category</CardTitle>
        <CardDescription>Active debt distribution across categories</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <ChartContainer config={chartConfig} className="h-full w-full max-h-[250px]">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20, top: 20 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.2} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              width={100}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => (
                    <div className="flex items-center gap-2 font-bold">{formatCurrency(value)}</div>
                  )}
                />
              }
            />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={[0, 4, 4, 0]} barSize={24} />
          </BarChart>
        </ChartContainer>

        {chartData.length === 0 && (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground italic">
            No active liabilities to display
          </div>
        )}
      </CardContent>
    </Card>
  );
}
