import React, { useState, useEffect } from 'react';
import UserLimit from '../UserLimit';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Car, Utensils, Briefcase, Wallet } from 'lucide-react';
import userLimitService from '@/services/userLimitService';
import categoryService from '@/services/categoryService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/AuthContext';
import getLimit from '@/api/limit/getLimit';
import getCategory from '@/api/getCategory';
import postCategory from '@/api/limit/postLimit';

const getIconForCategory = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('transport') || lower.includes('taxi') || lower.includes('travel')) return Car;
  if (lower.includes('meal') || lower.includes('food') || lower.includes('dinner')) return Utensils;
  if (lower.includes('office') || lower.includes('supplies')) return Briefcase;
  return Wallet;
};

export default function ActiveLimitsWidget({ onQuickClaim }) {
  const { user } = useAuth();

  const [limits, setLimits] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);

  const [selectedCategoryToAdd, setSelectedCategoryToAdd] = useState('');

  const [adding, setAdding] = useState(false);
  //============= FETCH DATA
  const fetchData = async () => {
    setLoading(true);
    try {
      const myLimits = await userLimitService.getMyLimits();
      setLimits(myLimits);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch limits');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    setLoading(true);
    const response = await getCategory(user.tk);

    setCategories(response);
    setLoading(false);
  };
  const fetchLimit = async () => {
    setLoading(true);
    const response = await getLimit(user.tk);

    setLimits(response);
     setLoading(false);
  };

  useEffect(() => {
    fetchCategory();
    fetchLimit();
    // fetchData();
  }, []);

  //==================================
  const handleOpenAddModal = () => {
    const existingCategoryIds = limits.map((limit) => limit.categoryId);

    const filteredCategories = categories.filter((category) => {
      return !existingCategoryIds.includes(category.id);
    });
    setAvailableCategories(filteredCategories);
    setIsAddModalOpen(true);
  };

  const handleCreateLimit = async () => {
    if (!selectedCategoryToAdd) return;
    // console.log(selectedCategoryToAdd);
    setAdding(true);
    try {
      const response = await postCategory(selectedCategoryToAdd, user.tk);
      console.log(response);
      toast.success('Limit generated successfully!');
      setIsAddModalOpen(false);
      fetchLimit() // Refresh limits
    } catch (e) {
      toast.error('Failed to generate limit');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Your Active Limits</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {loading ? (
          <div className="w-full flex justify-center p-8">
            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
          </div>
        ) : (
          <>
            {limits.map((limit) => {
              const Icon = getIconForCategory(limit.categoryName || 'Other');
              return (
                <div
                  key={limit.id}
                  onClick={() => onQuickClaim && onQuickClaim(limit)}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <UserLimit
                    name={limit.categoryName}
                    current={limit.limitUsed}
                    max={limit.totalLimit}
                    Icon={Icon}
                  />
                </div>
              );
            })}

            {/* Add New Limit Card */}
            <div
              onClick={handleOpenAddModal}
              className="bg-gray-50 border-2 border-dashed border-gray-300 h-28 p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors rounded-lg shadow-sm"
            >
              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <Plus className="h-6 w-6 text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-600">Add New Category</span>
            </div>
          </>
        )}
      </div>

      {/* Add Limit Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activate Category Limit</DialogTitle>
            <DialogDescription>Select a category to start claiming expenses.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {availableCategories.length > 0 ? (
              <select
                className="w-full p-2 border rounded-md"
                value={selectedCategoryToAdd}
                onChange={(e) => setSelectedCategoryToAdd(e.target.value)}
              >
                <option value="">-- Select Category --</option>
                {availableCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-500">You have activated all available categories.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLimit} disabled={!selectedCategoryToAdd || adding}>
              {adding ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
              Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
