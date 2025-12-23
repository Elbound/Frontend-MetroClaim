import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import getUsers from '@/api/user/getUsers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, Users, CreditCard, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import postProcessSalary from '@/api/finance/postProcessSalary';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import getPagedData from '@/api/paginated/getPagedData';

export const Route = createLazyFileRoute('/salary/')({
  component: SalaryPage,
});

function SalaryPage() {
  const { user, isFinance } = useAuth(); // Assuming isFinance is needed to show the button? Or just show it for now. User didn't specify. I'll show it.
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Process Salary States
  const [salaryDialogOpen, setSalaryDialogOpen] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(1);
  const [commitText, setCommitText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const fetchUsers = async () => {
    if (!user?.tk) return;
    setLoading(true);
    try {
      const { data, pages } = await getPagedData(currentPage, user.tk, 'user/on');
      setUsers(data);
      setTotalPage(pages);
    } catch (err) {
      setError(err.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user?.tk, currentPage]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const todayStr = format(new Date(), 'dd MMMM yyyy');
  const expectedCommitText = `commit salary today ${todayStr}`;

  const handleProcessSalary = async () => {
    if (!user?.tk) return;
    setIsSubmitting(true);
    try {
      await postProcessSalary(user.tk);
      toast.success('Salary processed successfully');
      setSalaryDialogOpen(false);
      resetDialog();
      fetchUsers(); // Refresh data
    } catch (error) {
      toast.error(error.message || 'Failed to process salary');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDialog = () => {
    setConfirmationStep(1);
    setCommitText('');
  };

  const handlePageChange = (change) => {
    const nextPage = currentPage + change;
    if (nextPage <= 0) return;
    if (totalPage && nextPage > totalPage) return;
    setCurrentPage(nextPage);
  };

  return (
    <div className="w-full p-6 min-h-screen bg-gray-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Salary Management</h1>
          <p className="text-gray-500 mt-1">
            Overview of employee salaries and reimbursement status.
          </p>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
          onClick={() => {
            resetDialog();
            setSalaryDialogOpen(true);
          }}
        >
          <Banknote className="w-4 h-4 mr-2" />
          Process Salary
        </Button>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-transparent hover:bg-transparent border-b border-gray-100">
                <TableHead className="w-[30%] py-4 pl-6 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Employee
                </TableHead>
                <TableHead className="w-[25%] py-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Bank Account
                </TableHead>
                <TableHead className="w-[20%] py-4 text-right text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Due Reimbursement
                </TableHead>
                <TableHead className="w-[25%] py-4 text-right pr-6 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Salary
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <Loader2 className="animate-spin h-6 w-6 text-gray-400 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((employee) => (
                  <TableRow
                    key={employee.id}
                    className="hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{employee.fullName}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 font-mono">
                            {employee.employeeId}
                          </span>
                          <span
                            className="text-xs text-gray-400 truncate max-w-[150px]"
                            title={employee.email}
                          >
                            {employee.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="font-mono">{employee.bankAccountNumber || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-right text-gray-700 font-medium">
                      {formatCurrency(employee.dueReimbursement || 0)}
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <span className="font-bold text-gray-900">
                        {formatCurrency(employee.salary)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                    No employees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(-1);
              }}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

          <div className="text-sm font-medium px-4 select-none">
            Page {currentPage} of {totalPage || 1}
          </div>

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(1);
              }}
              className={
                currentPage === totalPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Process Salary Dialog */}
      <Dialog
        open={salaryDialogOpen}
        onOpenChange={(open) => {
          if (!isSubmitting) setSalaryDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Process Monthly Salary</DialogTitle>
            <DialogDescription>
              {confirmationStep === 1
                ? 'Are you sure you want to process salary for all employees? This will calculate and disburse salaries along with any due reimbursements.'
                : 'Final Confirmation Required.'}
            </DialogDescription>
          </DialogHeader>

          {confirmationStep === 2 && (
            <div className="py-4 space-y-3">
              <p className="text-sm text-gray-600">
                To confirm, please type{' '}
                <span className="font-bold select-all text-gray-900">{expectedCommitText}</span>{' '}
                below:
              </p>
              <Input
                value={commitText}
                onChange={(e) => setCommitText(e.target.value)}
                placeholder={expectedCommitText}
                disabled={isSubmitting}
                className={
                  commitText === expectedCommitText
                    ? 'border-green-500 focus-visible:ring-green-500'
                    : ''
                }
              />
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:gap-0">
            {confirmationStep === 1 ? (
              <>
                <Button variant="outline" onClick={() => setSalaryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setConfirmationStep(2)}>Yes, Proceed</Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setConfirmationStep(1)}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  onClick={handleProcessSalary}
                  disabled={commitText !== expectedCommitText || isSubmitting}
                  className={
                    commitText === expectedCommitText ? 'bg-green-600 hover:bg-green-700' : ''
                  }
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Confirm Execution
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
