import { createLazyFileRoute } from '@tanstack/react-router';

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
import { Separator } from '@/components/ui/separator';
import { FileText, PlusCircle, LayoutList } from 'lucide-react';
import { toast } from 'sonner';
import getCategory from '@/api/getCategory';
import { Description } from '@radix-ui/react-dialog';
import { useAuth } from '@/hooks/AuthContext';
import ReciptList from '@/components/ReciptList';
import useImageConverter from '@/hooks/useImageConverter';

export const Route = createLazyFileRoute('/reimbursement/')({
  component: RouteComponent,
});

const formatCurrency = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0);

export default function RouteComponent() {
  const { user, isManager, isFinance } = useAuth();
  const { convertFile } = useImageConverter();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(null);
  const [amount, setAmount] = useState('');
  const [itemDate, setItemDate] = useState('');
  const [category, setCategory] = useState('');

  const [items, setItems] = useState([]);
  const [categroies, setCategories] = useState([]);
  const [reimbursement, setReimbursement] = useState(null);

  //get category
  useEffect(() => {
    const fetching = async () => {
      const response = await getCategory(user.tk);

      setCategories(response);
    };
    fetching();
  }, []);

  //submit reimbursement item
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
        toast.error('File Error', { description: 'File size must be under 10MB.' });
        return;
      }
      setImage(file);
    }
  };

  //create reimbursement item
  const handleCreateRecipt = (e) => {
    e.preventDefault();
    if (!image || parseFloat(amount) <= 0 || !amount) {
      toast.warning('Missing Data', {
        description: 'Please select an image and enter a valid amount.',
      });
      return;
    }
    
    const convertedImage = convertFile(image);

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

  //remove reimbursement item
  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
    toast.info('Item Removed');
  };

  //submit reimburesement
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !category || items.length === 0) {
      toast.error('Submission Failed', {
        description: 'Please fill in the Title, select a Category, and add at least one item.',
      });
      return;
    }

    const totalammount = items.reduce((total, i) => total + i.amount, 0);

    setReimbursement({
      Title: title,
      Description: desc,
      CategoryId: category,
      Items: items,
    });

    // console.log(JSON.stringify(reimbursement));

    console.log('SUBMITTED:', {
      totalAmount: totalammount,
      title: title,
      description: desc,
      category: category,
      items: items.map((i) => ({
        recipt: i.recipt,
        amount: i.amount,
        dateOfExpense: i.dateOfExpense,
      })),
    });

    toast.success('Reimbursement Submitted!', {
      description: `Claim for ${formatCurrency(totalammount)} has been submitted.`,
    });

    setTitle('');
    setDesc('');
    setCategory('');
    setItems([]);
    setReimbursement(null);
  };

  const totalClaimAmount = items.reduce((total, i) => total + i.amount, 0);

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
            {/* Category Select */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={setCategory} value={category} required>
                <SelectTrigger id="category" className="w-[200px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categroies.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <p className="text-sm text-muted-foreground">Provide details for the reviewer.</p>
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
              {/* File Upload Area (Preserving file logic with better UI) */}
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
                    {image ? `Selected: ${image.name}` : 'PNG, JPG, GIF up to 10MB'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                {/* Amount Input */}
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
                {/* Date of expense Input */}
                <div>
                  <Label htmlFor="date">Expense Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={itemDate}
                    onChange={(e) => setItemDate(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Add Item Button */}
            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={handleCreateRecipt}
                disabled={!image || parseFloat(amount) <= 0}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Item List (Using your original structure but cleaner) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center">
              <LayoutList className="w-5 h-5 mr-2 text-primary" /> Added Items ({items.length})
            </CardTitle>
            <span className="font-bold text-xl text-primary">
              Total Claim: {formatCurrency(totalClaimAmount)}
            </span>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>No receipt items added yet.</p>
              </div>
            ) : (
              items.map((item, index) => (
                // CRUCIAL: Pass required props to ReciptList
                <ReciptList
                  key={item.recipt}
                  value={item}
                  index={index}
                  onRemove={handleRemoveItem}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Final Submission Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={items.length === 0 || !title.trim() || !category}
          >
            Submit Request
          </Button>
        </div>
      </form>
    </div>
  );
}
