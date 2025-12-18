import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const ReciptList = ({ value, index, onRemove }) => {
  const { receipt, amount, dateOfExpense } = value;

  const formatCurrency = (amount) => 
    new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);

  return (
    <div className="flex items-center justify-between border p-3 rounded-lg mb-2">
      <div className="flex items-center space-x-4">
        <img
          src={receipt}
          alt="Receipt"
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <p className="font-bold text-gray-900">{formatCurrency(amount)}</p>
          {dateOfExpense && (
             <p className="text-xs text-muted-foreground">{format(new Date(dateOfExpense), 'dd MMM yyyy')}</p>
          )}
        </div>
      </div>
       {onRemove && (
        <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={() => onRemove(index)} 
            className="text-red-500 hover:text-red-700 hover:bg-red-50 hover:cursor-pointer"
        >
            <Trash className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default ReciptList;