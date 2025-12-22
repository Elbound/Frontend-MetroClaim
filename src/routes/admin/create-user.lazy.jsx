import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import postUser from '@/api/user/postUser';
import getManagers from '@/api/user/getManagers';
import getRoles from '@/api/role/getRoles';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowLeft, UserPlus, Save } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createLazyFileRoute('/admin/create-user')({
  component: CreateUserPage,
});

function CreateUserPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    password: '',
    salary: '',
    bankAccountNumber: '',
    managerId: '',
    roleIds: [] 
  });

  useEffect(() => {
    const fetchData = async () => {
        if (!user?.tk) return;
        setFetching(true);
        try {
            const [managersData, rolesData] = await Promise.all([
                getManagers(user.tk),
                getRoles(user.tk)
            ]);
            setManagers(managersData);
            setRoles(rolesData);
        } catch (err) {
            toast.error('Failed to load form data');
        } finally {
            setFetching(false);
        }
    };
    fetchData();
  }, [user?.tk]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleRole = (roleId) => {
    setFormData(prev => {
        const currentRoles = prev.roleIds;
        if (currentRoles.includes(roleId)) {
            return { ...prev, roleIds: currentRoles.filter(id => id !== roleId) };
        } else {
            return { ...prev, roleIds: [...currentRoles, roleId] };
        }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.tk) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        salary: Number(formData.salary),
        roleIds: formData.roleIds.length ? formData.roleIds : []
      };
      
      if (!payload.managerId) delete payload.managerId;

      await postUser(user.tk, payload);
      toast.success('User created successfully');
      navigate({ to: '/admin/user' });
    } catch (err) {
      toast.error(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/admin/user' })}>
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create New User</h1>
                <p className="text-gray-500 text-sm">Fill in the details to register a new employee.</p>
            </div>
        </div>

        <form onSubmit={handleSubmit}>
            <Card className="border-gray-200 shadow-md overflow-hidden">                
                <CardContent className="p-6 md:p-8 grid gap-6 md:grid-cols-2">
                    {/* Column 1 */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                             <Label htmlFor="employeeId" className="text-gray-700">Employee ID <span className="text-red-500">*</span></Label>
                             <Input 
                                id="employeeId" 
                                name="employeeId" 
                                value={formData.employeeId} 
                                onChange={handleChange} 
                                required 
                                placeholder="e.g. EMP001" 
                                className="focus-visible:ring-[#003366]"
                             />
                        </div>

                        <div className="space-y-2">
                             <Label htmlFor="fullName" className="text-gray-700">Full Name <span className="text-red-500">*</span></Label>
                             <Input 
                                id="fullName" 
                                name="fullName" 
                                value={formData.fullName} 
                                onChange={handleChange} 
                                required 
                                placeholder="John Doe" 
                                className="focus-visible:ring-[#003366]"
                             />
                        </div>

                        <div className="space-y-2">
                             <Label htmlFor="email" className="text-gray-700">Email Address <span className="text-red-500">*</span></Label>
                             <Input 
                                id="email" 
                                name="email" 
                                type="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                                placeholder="john@company.com" 
                                className="focus-visible:ring-[#003366]"
                             />
                        </div>

                        <div className="space-y-2">
                             <Label htmlFor="password" className="text-gray-700">Password <span className="text-red-500">*</span></Label>
                             <Input 
                                id="password" 
                                name="password" 
                                type="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                                placeholder="••••••••" 
                                className="focus-visible:ring-[#003366]"
                             />
                             <p className="text-[10px] text-gray-400">Temporary password for initial login.</p>
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-6">
                         <div className="space-y-2">
                             <Label htmlFor="salary" className="text-gray-700">Base Salary (IDR) <span className="text-red-500">*</span></Label>
                             <Input 
                                id="salary" 
                                name="salary" 
                                type="number" 
                                value={formData.salary} 
                                onChange={handleChange} 
                                required 
                                placeholder="0" 
                                className="focus-visible:ring-[#003366]"
                             />
                        </div>

                        <div className="space-y-2">
                             <Label htmlFor="bankAccountNumber" className="text-gray-700">Bank Account No. <span className="text-red-500">*</span></Label>
                             <Input 
                                id="bankAccountNumber" 
                                name="bankAccountNumber" 
                                value={formData.bankAccountNumber} 
                                onChange={handleChange} 
                                required 
                                placeholder="e.g. 1234567890" 
                                className="focus-visible:ring-[#003366]"
                             />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="managerId" className="text-gray-700">Direct Manager</Label>
                            <Select 
                                value={formData.managerId} 
                                onValueChange={(val) => setFormData(prev => ({ ...prev, managerId: val === 'none' ? '' : val }))}
                            >
                                <SelectTrigger className="focus:ring-[#003366]">
                                    <SelectValue placeholder="Select a manager (Optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">_ No Manager _</SelectItem>
                                    {managers.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.fullName} ({m.employeeId})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Label className="text-gray-700">Assign Roles <span className="text-red-500">*</span></Label>
                            <div className="flex flex-wrap gap-2 border border-gray-200 p-4 rounded-lg bg-gray-50/30">
                                {roles.length > 0 ? roles.map(role => (
                                    <div 
                                        key={role.id} 
                                        onClick={() => toggleRole(role.id)}
                                        className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                                            formData.roleIds.includes(role.id) 
                                            ? 'bg-[#003366] text-white border-[#003366] shadow-sm' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {role.name}
                                    </div>
                                )) : (
                                    <span className="text-xs text-gray-500 italic">Loading roles...</span>
                                )}
                            </div>
                            {formData.roleIds.length === 0 && <p className="text-[11px] text-amber-600">Please select at least one role.</p>}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="bg-gray-50 border-t border-gray-100 p-6 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => navigate({ to: '/admin/user' })} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-[#003366] hover:bg-blue-800 shadow-md min-w-[150px]" disabled={loading || fetching}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save User
                    </Button>
                </CardFooter>
            </Card>
        </form>
    </div>
  );
}
