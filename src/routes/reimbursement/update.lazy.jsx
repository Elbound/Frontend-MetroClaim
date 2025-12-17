import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { FileText, PlusCircle, LayoutList, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
// import getCategory from '@/api/getCategory'; // Removed as not needed
import { useAuth } from '@/hooks/AuthContext';
import ReciptList from '@/components/ReciptList';
import useImageConverter from '@/hooks/useImageConverter';
import putReimbursementUpdate from '@/api/reimbursement/putReimbursementUpdate';
import getReimbursementById from '@/api/reimbursement/getReimbursementById';
import { router } from '@/router';

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
  const { convertFile } = useImageConverter();

  // Get search params for ID
  const searchParams = Route.useSearch();
  const reimbursementId = searchParams.id;

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(null);
  const [amount, setAmount] = useState('');
  const [itemDate, setItemDate] = useState('');
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
        setTitle(detail.title || '');
        setDesc(detail.description || '');
        setCategory(detail.categoryName || 'Uncategorized'); // Use Name instead of ID

        if (detail.items && Array.isArray(detail.items)) {
          setItems(
            detail.items.map((i) => ({
              recipt: i.receipt,
              amount: i.amount,
              dateOfExpense: i.dateOfExpense,
            }))
          );
        }
        console.log(detail);
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

  // --- Handlers (Reuse from Create) ---

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
      const maxSize = 1 * 1024 * 1024;
      if (!allowedTypes.includes(file.type)) {
        toast.error('File Error', { description: 'Please select a PNG, JPG, or GIF file.' });
        return;
      }
      if (file.size > maxSize) {
        toast.error('File Error', { description: 'File size must be under 1MB.' });
        return;
      }
      setImage(file);
    }
  };

  const handleCreateRecipt = async (e) => {
    e.preventDefault();
    if (!image || parseFloat(amount) <= 0 || !amount) {
      toast.warning('Missing Data', {
        description: 'Please select an image and enter a valid amount.',
      });
      return;
    }

    const convertedImage = await convertFile(image);

    const newItem = {
      recipt: convertedImage,
      amount: parseFloat(amount),
      dateOfExpense: new Date(itemDate).toISOString(),
    };

    setItems([...items, newItem]);
    setImage(null);
    setAmount('');
    setItemDate('');
    toast.success('Item Added', {
      description: `Added ${formatCurrency(newItem.amount)} to the list.`,
    });
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
    toast.info('Item Removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || items.length === 0) {
      toast.error('Update Failed', {
        description: 'Please fill in the Title and ensure at least one item remains.',
      });
      return;
    }

    const payload = {
      title: title,
      description: desc,
      items: items.map((i) => ({
        amount: i.amount,
        dateOfExpense: i.dateOfExpense,
        receipt: i.recipt,
      })),
    };

    try {
      setIsSubmitting(true);
      await putReimbursementUpdate(reimbursementId, payload, user.tk);

      toast.success('Reimbursement Updated!', {
        description: 'Your request has been successfully updated.',
      });

      navigate({ to: '/history' });
    } catch (error) {
      console.error(error);

      if (error.status === 400) {
        setErrorDialogMsg(error.message || 'The selected dates overlap with an existing trip.');
        setErrorDialogOpen(true);
      } else {
        toast.error(error.message || 'Failed to create trip');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalClaimAmount = items.reduce((total, i) => total + i.amount, 0);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading details...</p>
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

        {/* Add Receipt Item Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <PlusCircle className="w-5 h-5 mr-2 text-primary" /> Add New Expense
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="file-upload-input">Receipt Photo</Label>
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 bg-gray-50">
                  <FileText className="w-8 h-8 text-muted-foreground mb-2" />
                  <Label
                    htmlFor="file-upload"
                    className="cursor-pointer text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    Click to upload
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {image ? `Selected: ${image.name}` : 'PNG, JPG, GIF up to 1MB'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                  />
                  <p className="text-sm text-muted-foreground">
                    Current Amount: {formatCurrency(amount)}
                  </p>
                </div>
                <div className="pt-4">
                  <Label htmlFor="date">Expense Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={itemDate}
                    onChange={(e) => setItemDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={handleCreateRecipt}
                disabled={!image || parseFloat(amount) <= 0 || !itemDate}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Item List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center">
              <LayoutList className="w-5 h-5 mr-2 text-primary" /> Current Items ({items.length})
            </CardTitle>
            <span className="font-bold text-xl text-primary">
              Total: {formatCurrency(totalClaimAmount)}
            </span>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>No receipt items added yet.</p>
              </div>
            ) : (
              items.map((item, index) => (
                <ReciptList
                  key={index} // Using index as key since items might not have unique IDs if new
                  value={item}
                  index={index}
                  onRemove={handleRemoveItem}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/history' })}
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
