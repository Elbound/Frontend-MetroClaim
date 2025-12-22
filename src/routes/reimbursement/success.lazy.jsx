import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { router } from '@/router';
import { Loader2 } from 'lucide-react';

export const Route = createLazyFileRoute('/reimbursement/success')({
  component: SuccessPage,
  validateSearch: (search) => {
    return {
      amount: search.amount,
    };
  },
});

function SuccessPage() {
  const { amount } = Route.useSearch();
  const hasAlertShown = useRef(false);

  useEffect(() => {
    if (hasAlertShown.current) return;
    hasAlertShown.current = true;

    const formattedAmount = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount || 0);

    Swal.fire({
      title: 'Success!',
      text: `Claim for ${formattedAmount} has been submitted.`,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#0f172a',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then(() => {
      router.navigate({ to: '/dashboard' });
    });
  }, [amount]);

  return (
    <div className="flex h-[80vh] w-full items-center justify-center bg-gray-50/50">
       {/* Optional visual or loader behind the alert */}
       <div className="flex flex-col items-center gap-4 text-gray-400 opacity-50">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p>Processing...</p>
       </div>
    </div>
  );
}
