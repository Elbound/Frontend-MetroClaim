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

export default function LimitChartWidget() {
  const { user } = useAuth();
  const [limits, setLimits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLimit = async () => {
    try {
      setLoading(true);
      const response = await getLimit(user.tk);
      setLimits(response);
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
  };

  useEffect(() => {
    if (user?.tk) fetchLimit();
  }, [user?.tk]);

  const chartData = useMemo(() => {
    return limits.map((item, index) => ({
      category: item.categoryName,
      used: item.limitUsed,
      // Using var() for Tailwind v4 OKLCH support
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

  if (!loading && limits.length === 0) {
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
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="used"
              nameKey="category"
              innerRadius={50}
              outerRadius={95}
              paddingAngle={3}
              strokeWidth={0}
            />
            <ChartLegend content={<ChartLegendContent />} className="mt-4 flex-wrap gap-2" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
