import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUp, Loader2, Trash, Image as ImageIcon, X } from 'lucide-react';
import useCloudinaryUpload from '@/hooks/useCloudinaryUpload';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ExpenseItemInput({ item, index, onUpdate, onRemove }) {
  const { upload, loading } = useCloudinaryUpload();
  const fileInputRef = useRef(null);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
    const maxSize = 1 * 1024 * 1024; // 1MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('File Error', { description: 'Please select a PNG, JPG, or GIF file.' });
      return;
    }
    if (file.size > maxSize) {
      toast.error('File Error', { description: 'File size must be under 1MB.' });
      return;
    }

    const url = await upload(file);
    if (url) {
      onUpdate(index, 'receipt', url);
    }
    // Reset input to allow selecting same file again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    onUpdate(index, 'receipt', '');
  };

  return (
    <div className="group relative border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header with Numbered Badge and Delete */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm shadow-sm">
            {index + 1}
          </div>
          <span className="font-semibold text-gray-700">Expense Item</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-gray-400 hover:text-red-600 hover:bg-red-50 -mr-2 -mt-2 transition-colors"
        >
          <Trash className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Receipt Upload Area - Takes up more space on larger screens */}
        <div className="md:col-span-5 flex flex-col">
          <Label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            Receipt
          </Label>
          <div
            onClick={triggerFileUpload}
            className={cn(
              "relative w-full h-40 md:h-auto md:flex-1 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden bg-gray-50 group-hover/upload:bg-gray-100",
              item.receipt
                ? "border-green-300 hover:border-green-500"
                : "border-gray-300 hover:border-primary/50"
            )}
          >
            {loading ? (
              <div className="flex flex-col items-center gap-2 text-primary">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-xs font-medium">Uploading...</span>
              </div>
            ) : item.receipt ? (
              <>
                <img
                  src={item.receipt}
                  alt="Receipt"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px] z-10">
                   <Button 
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 text-xs"
                   >
                      Change
                   </Button>
                   <Button 
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleRemoveImage}
                   >
                      <X className="w-4 h-4" />
                   </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <FileUp className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Click to Upload</p>
                  <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, GIF (Max 1MB)</p>
                </div>
              </div>
            )}
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
              accept="image/png, image/jpeg, image/gif"
            />
          </div>
        </div>

        {/* Amount and Date - Takes up remaining space */}
        <div className="md:col-span-7 space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`amount-${index}`} className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Amount (IDR)
            </Label>
            <div className="relative">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">Rp</span>
               <Input
                id={`amount-${index}`}
                type="text"
                value={item.amount ? new Intl.NumberFormat('id-ID').format(item.amount) : ''}
                onChange={(e) => {
                  // Connect raw number to state, but display formatted
                  const rawValue = e.target.value.replace(/\D/g, '');
                  onUpdate(index, 'amount', rawValue ? parseFloat(rawValue) : '');
                }}
                placeholder="0"
                className="pl-9 h-11 text-lg font-medium"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`date-${index}`} className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Date
            </Label>
            <Input
              id={`date-${index}`}
              type="date"
              value={item.dateOfExpense ? item.dateOfExpense.split('T')[0] : ''}
              onChange={(e) => {
                 const dateVal = e.target.value;
                 if(dateVal) {
                    onUpdate(index, 'dateOfExpense', new Date(dateVal).toISOString());
                 } else {
                    onUpdate(index, 'dateOfExpense', '');
                 }
              }}
              className="h-11"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
