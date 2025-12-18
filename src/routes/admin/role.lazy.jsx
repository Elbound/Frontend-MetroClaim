import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import getRoles from '@/api/role/getRoles';
import postRole from '@/api/role/postRole';
import putRole from '@/api/role/putRole';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldCheck, Plus, Pencil, Save, Users, Settings2 } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createLazyFileRoute('/admin/role')({
  component: AdminRolePage,
});

function AdminRolePage() {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' | 'update'
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRoles = async () => {
    if (!user?.tk) return;
    setLoading(true);
    try {
      const data = await getRoles(user.tk);
      setRoles(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [user?.tk]);

  const handleOpenCreate = () => {
    setDialogMode('create');
    setRoleName('');
    setSelectedRole(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (role) => {
    setDialogMode('update');
    setRoleName(role.name);
    setSelectedRole(role);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    setIsSubmitting(true);
    try {
        if (dialogMode === 'create') {
            await postRole(user.tk, { name: roleName });
            toast.success('Role created successfully');
        } else {
            if (!selectedRole) return;
            await putRole(user.tk, selectedRole.id, { ...selectedRole, name: roleName });
            toast.success('Role updated successfully');
        }
        setIsDialogOpen(false);
        fetchRoles();
    } catch (err) {
        toast.error(err.message || `Failed to ${dialogMode} role`);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-6 min-h-screen bg-gray-50/50 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Role Management</h1>
            <p className="text-gray-500">Define and manage user roles.</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-[#003366] hover:bg-blue-800 text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Add New Role
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
            {roles.length > 0 ? (
                roles.map((item) => (
                    <Card key={item.id} className="group hover:shadow-md transition-all duration-200 border-gray-200">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-bold text-[#003366]">
                                {item.name}
                            </CardTitle>
                            <ShieldCheck className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>Active Role</span>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2 border-t border-gray-50 bg-gray-50/50">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full text-gray-600 hover:text-[#003366] hover:bg-white"
                                onClick={() => handleOpenEdit(item)}
                            >
                                <Settings2 className="w-4 h-4 mr-2" />
                                Edit Configuration
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <div className="col-span-full text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                    <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No roles defined</h3>
                    <p className="text-gray-500 mb-4">Get started by creating a new role.</p>
                    <Button onClick={handleOpenCreate} variant="outline">
                        Create Role
                    </Button>
                </div>
            )}
        </div>
      )}

      {/* Create/Update Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'create' ? 'Create New Role' : 'Edit Role'}</DialogTitle>
            <DialogDescription>
                {dialogMode === 'create' ? 'Add a new role to the system.' : 'Update the role name.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input 
                    id="roleName" 
                    value={roleName} 
                    onChange={(e) => setRoleName(e.target.value)} 
                    placeholder="e.g. Supervisor" 
                    required
                    className="focus-visible:ring-[#003366]"
                />
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" className="bg-[#003366] hover:bg-blue-800" disabled={isSubmitting || !roleName.trim()}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {dialogMode === 'create' ? 'Create Role' : 'Save Changes'}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
