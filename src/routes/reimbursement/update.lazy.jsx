import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { LayoutList, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
// import getCategory from '@/api/getCategory'; // Removed as not needed
import { useAuth } from '@/hooks/AuthContext';
import putReimbursementUpdate from '@/api/reimbursement/putReimbursementUpdate';
import getReimbursementById from '@/api/reimbursement/getReimbursementById';
import { router } from '@/router';
import ExpenseItemInput from '@/components/ExpenseItemInput';
import { PlusCircle } from 'lucide-react';
import { FileText } from 'lucide-react';

export const Route = createLazyFileRoute('/reimbursement/update')({
  component: RouteComponent,
  validateSearch: (search) => ({
    id: search?.id,
  }),
});

const formatCurrency = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0);

function RouteComponent() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get search params for ID
  const searchParams = Route.useSearch();
  const reimbursementId = searchParams.id;

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');

  const [items, setItems] = useState([]);
  // const [categories, setCategories] = useState([]); // Removed
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogMsg, setErrorDialogMsg] = useState('');

  // Initial Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.tk || !reimbursementId) return;

      try {
        setIsLoading(true);

        const detail = await getReimbursementById(reimbursementId, user.tk);
        console.log(detail);

        setTitle(detail.title || '');
        setDesc(detail.description || '');
        setCategory(detail.categoryName || 'Uncategorized'); // Use Name instead of ID

        if (detail.items && Array.isArray(detail.items)) {
          setItems(
            detail.items.map((i) => ({
              id: crypto.randomUUID(), // Assign local ID for list management
              receipt: i.receipt,
              amount: i.amount,
              dateOfExpense: i.dateOfExpense,
            }))
          );
        }
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
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user?.tk, reimbursementId]);

  // --- Dynamic List Handlers ---

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: crypto.randomUUID(), receipt: '', amount: '', dateOfExpense: '' }
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) {
      toast.error('Cannot remove the last item.');
      return;
    }
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleUpdateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // --- Submission ---

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error('Update Failed', {
        description: 'Please fill in the Title.',
      });
      return;
    }

    const invalidItems = items.filter(
      (item) => !item.receipt || !item.amount || item.amount <= 0 || !item.dateOfExpense
    );

    if (invalidItems.length > 0) {
      toast.error('Incomplete Items', {
        description: 'Please ensure all items have a receipt, valid amount, and date.',
      });
      return;
    }

    const payload = {
      title: title,
      description: desc,
      items: items.map((i) => ({
        amount: parseFloat(i.amount),
        dateOfExpense: i.dateOfExpense,
        receipt: i.receipt,
      })),
    };
    
    const totalammount = items.reduce((total, i) => total + (parseFloat(i.amount) || 0), 0);

    try {
      setIsSubmitting(true);
      await putReimbursementUpdate(reimbursementId, payload, user.tk);

      // Show inline success alert
      Swal.fire({
          title: 'Success!',
          text: `Claim for ${formatCurrency(totalammount)} has been updated.`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0f172a',
          allowOutsideClick: false,
          allowEscapeKey: false
      }).then(() => {
           // Navigate to success page
           router.navigate({ to: '/dashboard' });
      });

    } catch (error) {
      console.error(error);

      if (error.status === 400) {
        setErrorDialogMsg(error.message || 'The selected dates overlap with an existing trip.');
        setErrorDialogOpen(true);
      } else {
        toast.error(error.message || 'Failed to update reimbursement');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalClaimAmount = items.reduce((total, i) => total + (parseFloat(i.amount) || 0), 0);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-gray-400">
           <Loader2 className="h-8 w-8 animate-spin" />
           <p className="text-sm">Loading details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-900">Update Reimbursement Request</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" /> Claim Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Input - Read Only */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                readOnly
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Category cannot be changed during update.
              </p>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Q1 Travel Expense"
                required
              />
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                placeholder="Write a few sentences about the purpose of the reimbursement."
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Dynamic Item List */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center text-gray-800">
                 <LayoutList className="w-5 h-5 mr-2" /> Expense Items
              </h3>
              <span className="font-bold text-lg text-primary">
                Total: {formatCurrency(totalClaimAmount)}
              </span>
           </div>

           {items.map((item, index) => (
             <ExpenseItemInput
               key={item.id}
               item={item}
               index={index}
               onUpdate={handleUpdateItem}
               onRemove={handleRemoveItem}
             />
           ))}

           <Button
             type="button"
             variant="outline"
             className="w-full border-dashed border-2 py-6 text-muted-foreground hover:text-primary hover:border-primary"
             onClick={handleAddItem}
           >
             <PlusCircle className="w-5 h-5 mr-2" />
             Add Another Item
           </Button>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/dashboard' })}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={items.length === 0 || !title.trim() || !category || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>

      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle className="h-5 w-5" />
              <DialogTitle>Trip Schedule Conflict</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 py-2">{errorDialogMsg}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setErrorDialogOpen(false)}
              className="bg-slate-900 text-white hover:bg-slate-800"
            >
              Understood, I'll fix it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
