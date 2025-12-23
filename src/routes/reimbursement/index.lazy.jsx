import { createLazyFileRoute, useLocation } from '@tanstack/react-router';

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
import { FileText, PlusCircle, LayoutList, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/AuthContext';
import postReimbursementCreate from '@/api/reimbursement/postReimbursementCreate';
import { router } from '@/router';
import ExpenseItemInput from '@/components/ExpenseItemInput';

export const Route = createLazyFileRoute('/reimbursement/')({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      categoryId: search.categoryId,
      categoryName: search.categoryName,
    };
  },

  parseSearch: (searchStr) => {
    return Object.fromEntries(new URLSearchParams(searchStr).entries());
  },
});

const formatCurrency = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0);

export default function RouteComponent() {
  const search = Route.useSearch();
  const selectedCategoryId = search.categoryId || '';
  const selectedCategoryName = search.categoryName || '';

  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  
  // Dynamic list state
  const [items, setItems] = useState([
    { id: crypto.randomUUID(), receipt: '', amount: '', dateOfExpense: '' }
  ]);

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogMsg, setErrorDialogMsg] = useState('');

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
    if (!title.trim() || !selectedCategoryId) {
      toast.error('Missing Info', { description: 'Please fill in the Title and Category.' });
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

    const totalammount = items.reduce((total, i) => total + parseFloat(i.amount), 0);

    const submitedData = {
      title: title,
      description: desc,
      categoryId: selectedCategoryId,
      items: items.map(item => ({
        receipt: item.receipt,
        amount: parseFloat(item.amount),
        dateOfExpense: item.dateOfExpense
      })),
    };

    console.log('Submitting:', submitedData);

    try {
      setIsLoading(true);
      await postReimbursementCreate(submitedData, user.tk);
      
      Swal.fire({
          title: 'Success!',
          text: `Claim for ${formatCurrency(totalammount)} has been submitted.`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0f172a',
          allowOutsideClick: false,
          allowEscapeKey: false
      }).then(() => {
          router.navigate({ to: '/dashboard' });
      });

      // Reset form (though we are navigating away, good practice)
      setTitle('');
      setDesc('');
      setItems([{ id: crypto.randomUUID(), receipt: '', amount: '', dateOfExpense: '' }]);
       
    } catch (error) {
      console.error(error);
      if (error.status === 400) {
        setErrorDialogMsg(error.message || 'Something wrong with input');
        setErrorDialogOpen(true);
      } else {
        toast.error(error.message || 'Failed to create reimbursement');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const totalClaimAmount = items.reduce((total, i) => total + (parseFloat(i.amount) || 0), 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-900">New Reimbursement Request</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" /> Claim Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="p-2 bg-gray-50 rounded border text-sm">{selectedCategoryName || 'No Category Selected'}</div>
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

          {/* Final Submission Button */}
          <div className="flex justify-end pt-4 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.navigate({ to: '/dashboard' })}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </div>
        </form>

      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle className="h-5 w-5" />
              <DialogTitle>Bad Request</DialogTitle>
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
