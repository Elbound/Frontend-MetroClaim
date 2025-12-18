import FinanceBarDataWidget from '@/components/dashboard/finance/FinanceBarDataWidget';
import FinanceSummaryWidget from '@/components/dashboard/finance/FinanceSummaryWidget';
import { PaydayWidget } from '@/components/dashboard/finance/PaydayWidget';
import { useAuth } from '@/hooks/AuthContext';
import { router } from '@/router';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/dashboard/finance')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isFinance } = useAuth();

  if (!isFinance) {
    router.navigate({
      to: '/error',
      search: {
        status: 403,
        msg: 'Need Finance Role',
      },
    });
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mt-6">
        <FinanceSummaryWidget />
      </div>
      <div className="mt-8">
        <PaydayWidget />
      </div>
      <div className="mt-6">
        <FinanceBarDataWidget />
      </div>
      {/* <div className="mt-4">placeholder</div> */}
    </div>
  );
}
