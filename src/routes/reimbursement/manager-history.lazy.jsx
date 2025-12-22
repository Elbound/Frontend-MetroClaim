import { createLazyFileRoute } from '@tanstack/react-router';
import { useAuth } from '../../hooks/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import ReimbursementDetail from '@/components/ReimbursementDetail';
import getReimbursementById from '@/api/reimbursement/getReimbursementById';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { router } from '@/router';
import getReimbursementManagerHistory from '@/api/reimbursement/getReimbursementManagerHistory';
import StatusBadge from '@/components/ui/StatusBadge';

export const Route = createLazyFileRoute('/reimbursement/manager-history')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  const [reimbursements, setReimbursements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedId, setSelectedId] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const fetchHistory = async () => {
    if (!user?.tk) return;
    try {
      setIsLoading(true);
      const data = await getReimbursementManagerHistory(user.tk);
      setReimbursements(data);
    } catch (error) {
      toast.error('Error', { description: 'Failed to load history list.' });
      router.navigate({
        to: '/error',
        replace: true,
        search: {
          status: error.status || 500,
          msg: error.message || 'An unexpected error occurred.',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user?.tk]);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!selectedId || !user?.tk) {
        setDetailData(null);
        return;
      }

      setIsDetailLoading(true);
      try {
        const detail = await getReimbursementById(selectedId, user.tk);
        setDetailData(detail);
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
        setIsDetailLoading(false);
      }
    };

    fetchDetail();
  }, [selectedId, user?.tk]);

  const closeDetail = () => {
    setSelectedId(null);
    setDetailData(null);
  };

  return (
    <div className="mx-6 mt-5 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Reimbursement History</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-transparent hover:bg-transparent border-b border-gray-100">
                <TableHead className="w-[20%] py-4 pl-6 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Title
                </TableHead>
                <TableHead className="w-[15%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  User
                </TableHead>
                <TableHead className="w-[15%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Category
                </TableHead>
                <TableHead className="w-[15%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Cost
                </TableHead>
                <TableHead className="w-[15%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="w-[20%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Created At
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : (
                reimbursements?.map((item) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedId(item.id)}
                  >
                    <TableCell className="py-4 pl-6 font-medium text-gray-900">
                      {item.title}
                    </TableCell>
                    <TableCell className="py-4 text-gray-600">{item.userFullName}</TableCell>
                    <TableCell className="py-4 text-gray-600">{item.categoryName}</TableCell>
                    <TableCell className="py-4 font-medium">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      }).format(item.totalAmount)}
                    </TableCell>
                    <TableCell className="py-4">
                      <StatusBadge status={item.status}/>
              
                    </TableCell>
                    <TableCell className="py-4 text-gray-600 text-sm">
                      {format(new Date(item.createdAt), 'dd MMM yyyy, HH:mm')}
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!isLoading && (!reimbursements || reimbursements.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                    No history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selectedId} onOpenChange={(open) => !open && closeDetail()}>
        <SheetContent className="sm:max-w-xl w-full flex flex-col h-full">
          <SheetHeader className="mb-4">
            <SheetTitle>Request Details</SheetTitle>
            <SheetDescription>View past reimbursement details.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {isDetailLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : detailData ? (
              <ReimbursementDetail
                detailData={detailData}
                onClose={closeDetail}
                readOnly={true}
                userRole="Finance"
              />
            ) : (
              <p className="p-4 text-center text-muted-foreground">
                Please select an item to view details.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
