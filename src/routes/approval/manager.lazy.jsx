import { createLazyFileRoute } from '@tanstack/react-router';
import { useAuth } from '../../hooks/AuthContext';
import { router } from '../../router';
import ReimbursementList from '../../components/ReimbursementList';
import { Check, RotateCcw, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';



export const Route = createLazyFileRoute('/approval/manager')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isManager } = useAuth();

  // Mock data \
  const requests = [
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      title: 'Travel Expense',
      description: 'Business trip to Jakarta',
      totalAmount: 500,
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Jane Smith',
      title: 'Office Supplies',
      description: 'Purchased stationery and office materials',
      totalAmount: 200,
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'Bob Johnson',
      title: 'Conference Fee',
      description: 'Registration for tech conference',
      totalAmount: 300,
    },
  ];

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests?.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">
                    {req.employeeName || req.employeeId}
                  </TableCell>
                  <TableCell>
                    <div>{req.title}</div>
                    <div className="text-xs text-gray-500 truncate w-48">{req.description}</div>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                      req.totalAmount || 0
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                        onClick={() => openAction(req.id, 0)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                        onClick={() => openAction(req.id, 2)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={() => openAction(req.id, 1)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!requests ||
                (requests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
                      All caught up! No pending approvals.
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
