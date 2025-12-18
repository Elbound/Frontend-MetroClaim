import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import getCategory from '@/api/getCategory';
import postCategory from '@/api/category/postCategory';
import putCategory from '@/api/category/putCategory';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, FolderTree, Plus, Pencil, Tag, Banknote } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createLazyFileRoute('/admin/category')({
  component: AdminCategoryPage,
});

function AdminCategoryPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' | 'update'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', limit: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    if (!user?.tk) return;
    setLoading(true);
    try {
      const data = await getCategory(user.tk);
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [user?.tk]);

  const handleOpenCreate = () => {
    setDialogMode('create');
    setFormData({ name: '', limit: '' });
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (category) => {
    setDialogMode('update');
    setFormData({ name: category.name, limit: category.limit });
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
        const payload = {
            name: formData.name,
            limit: Number(formData.limit)
        };

        if (dialogMode === 'create') {
            await postCategory(user.tk, payload);
            toast.success('Category created successfully');
        } else {
            if (!selectedCategory) return;
            await putCategory(user.tk, selectedCategory.id, payload);
            toast.success('Category updated successfully');
        }
        setIsDialogOpen(false);
        fetchCategories();
    } catch (err) {
        toast.error(err.message || `Failed to ${dialogMode} category`);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-6 min-h-screen bg-gray-50/50 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Category Management</h1>
            <p className="text-gray-500">Manage expense categories and limits.</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-[#003366] hover:bg-blue-800 text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Add New Category
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500 bg-red-50 rounded-lg">
            {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.length > 0 ? (
                categories.map((item) => (
                    <Card key={item.id} className="group hover:shadow-md transition-all duration-200 border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gray-50/30">
                            <CardTitle className="text-lg font-bold text-[#003366]">
                                {item.name}
                            </CardTitle>
                            <FolderTree className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Banknote className="w-4 h-4 text-green-600" />
                                <span className="font-semibold">{formatCurrency(item.limit)}</span>
                                <span className="text-xs text-gray-400 font-normal">limit</span>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2 border-t border-gray-50 bg-gray-50/30">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full text-xs hover:bg-[#003366] hover:text-white border-gray-200"
                                onClick={() => handleOpenEdit(item)}
                            >
                                <Pencil className="w-3 h-3 mr-2" /> Edit Details
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <div className="col-span-full text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                    <FolderTree className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No categories found</h3>
                    <p className="text-gray-500 mb-4">Define approval categories to get started.</p>
                    <Button onClick={handleOpenCreate} variant="outline">
                        Create Category
                    </Button>
                </div>
            )}
        </div>
      )}

      {/* Create/Update Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'create' ? 'Create New Category' : 'Edit Category'}</DialogTitle>
            <DialogDescription>
                {dialogMode === 'create' ? 'Add a new expense category.' : 'Update category details.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input 
                    id="categoryName" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="e.g. Travel" 
                    required
                    className="focus-visible:ring-[#003366]"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="categoryLimit">Limit (IDR)</Label>
                <Input 
                    id="categoryLimit" 
                    type="number"
                    value={formData.limit} 
                    onChange={(e) => setFormData({ ...formData, limit: e.target.value })} 
                    placeholder="0" 
                    required
                    className="focus-visible:ring-[#003366]"
                />
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" className="bg-[#003366] hover:bg-blue-800" disabled={isSubmitting || !formData.name.trim()}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {dialogMode === 'create' ? 'Create' : 'Save Changes'}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
