import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { router } from '@/router';
import { Loader2 } from 'lucide-react';

export const Route = createLazyFileRoute('/trip/success')({
  component: SuccessPage,
  validateSearch: (search) => {
    return {
      title: search.title,
    };
  },
});

function SuccessPage() {
  const { title } = Route.useSearch();
  const hasAlertShown = useRef(false);

  useEffect(() => {
    if (hasAlertShown.current) return;
    hasAlertShown.current = true;

    Swal.fire({
      title: 'Trip Created!',
      text: `Trip "${title || 'New Trip'}" has been successfully created.`,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#0f172a',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then(() => {
      router.navigate({ to: '/trip' });
    });
  }, [title]);

  return (
    <div className="flex h-[80vh] w-full items-center justify-center bg-gray-50/50">
       <div className="flex flex-col items-center gap-4 text-gray-400 opacity-50">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p>Processing...</p>
       </div>
    </div>
  );
}
