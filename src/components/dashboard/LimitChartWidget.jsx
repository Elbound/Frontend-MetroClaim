import React, { useEffect, useMemo, useState } from 'react';
import getLimit from '@/api/limit/getLimit';
import { useAuth } from '@/hooks/AuthContext';
import { router } from '@/router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';
import { PieChart, Pie } from 'recharts';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

export default function LimitChartWidget({ limitsData, limitChartLoading = true }) {
  const { user } = useAuth();
  // const [limits, setLimits] = useState(limitsData);
  // const [loading, setLoading] = useState(false);

  //===========fetch data==============
  const limits = limitsData;
  const loading = limitChartLoading;
  //====================================
  const totalUsed = useMemo(() => {
    return limits.reduce((sum, item) => sum + item.limitUsed, 0);
  }, [limits]);

  const chartData = useMemo(() => {
    return limits.map((item, index) => ({
      category: item.categoryName,
      used: item.limitUsed,
      fill: `var(--chart-${(index % 5) + 1})`,
    }));
  }, [limits]);

  const chartConfig = useMemo(() => {
    const config = {
      used: { label: 'Used Amount' },
    };
    limits.forEach((item, index) => {
      config[item.categoryName] = {
        label: item.categoryName,
        color: `var(--chart-${(index % 5) + 1})`,
      };
    });
    return config;
  }, [limits]);

  if (loading) {
    return (
      <Card className="flex flex-col h-[350px] items-center justify-center">
        <p className="text-muted-foreground animate-pulse text-sm">Loading usage data...</p>
      </Card>
    );
  }

  if (!loading && totalUsed <= 0) {
    return (
      <Card className="flex flex-col h-[350px] items-center justify-center border-dashed">
        <p className="text-muted-foreground text-sm">No limit data available.</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col border-none shadow-none bg-transparent">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-lg">Limit Usage</CardTitle>
        <CardDescription>Distribution by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => (value !== undefined ? formatCurrency(value) : '')}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="used"
              nameKey="category"
              innerRadius={50}
              outerRadius={95}
              paddingAngle={0}
              strokeWidth={0}
            />
            <ChartLegend
              content={
                <ChartLegendContent
                  formatter={(value, entry) => {
                    const amount = entry?.payload?.used;
                    return (
                      <span className="text-xs font-medium">
                        {value}{' '}
                        <span className="text-muted-foreground ml-1">
                          ({formatCurrency(amount)})
                        </span>
                      </span>
                    );
                  }}
                />
              }
              className="mt-4 flex-wrap gap-2"
            />
          </PieChart>
        </ChartContainer>
        <div>Total Limit used: {formatCurrency(totalUsed)}</div>
      </CardContent>
    </Card>
  );
}
