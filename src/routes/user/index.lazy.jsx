import { createLazyFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/AuthContext';
import { useEffect, useState } from 'react';
import getUserById from '@/api/user/getUserById';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, Mail, CreditCard, Wallet, Shield, Building, Key } from 'lucide-react';
import { format } from 'date-fns';

export const Route = createLazyFileRoute('/user/')({
  component: UserProfilePage,
});

function UserProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.tk || !user?.id) return;
      try {
        setLoading(true);
        const data = await getUserById(user.tk, user.id);
        
        let managerName = null;
        if (data.managerId) {
            try {
                const managerData = await getUserById(user.tk, data.managerId);
                managerName = managerData.fullName;
            } catch (ignore) {
                console.warn("Could not fetch manager details", ignore);
            }
        }

        setProfile({ ...data, managerName });
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">

      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-[#003366] h-32 w-full relative">
            <div className="absolute -bottom-12 left-8">
                <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center text-[#003366] text-3xl font-bold">
                    {getInitials(profile.fullName)}
                </div>
            </div>
        </div>
        
        <CardHeader className="pt-16 pb-6 px-8">
          <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl font-bold text-gray-900">{profile.fullName}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-sm font-medium border-gray-300">
                         {profile.employeeId}
                    </Badge>
                     <div className="flex gap-1">
                        {profile.roles?.map((role, i) => (
                            <Badge key={i} className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                                {role}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4" /> Personal Info
                    </h3>
                    <div className="space-y-3">
                        <div className="group p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all">
                            <label className="text-xs text-gray-500 block mb-1">Email Address</label>
                            <div className="flex items-center gap-2 text-gray-900 font-medium break-all">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {profile.email}
                            </div>
                        </div>
                        <div className="group p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all">
                            <label className="text-xs text-gray-500 block mb-1">Joined Date</label>
                             <div className="flex items-center gap-2 text-gray-900 font-medium">
                                <Key className="w-4 h-4 text-gray-400" />
                                {profile.createdAt ? format(new Date(profile.createdAt), 'dd MMMM yyyy') : '-'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Employment Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <Building className="w-4 h-4" /> Employment
                    </h3>
                    <div className="space-y-3">
                         <div className="group p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all">
                            <label className="text-xs text-gray-500 block mb-1">Direct Manager</label>
                            <div className="flex items-center gap-2 text-gray-900 font-medium">
                                <Shield className="w-4 h-4 text-green-600" />
                                {profile.managerId ? (profile.managerName || profile.managerId) : 'No Manager'}
                            </div>
                        </div>
                        <div className="group p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all">
                             <label className="text-xs text-gray-500 block mb-1">Monthly Salary</label>
                             <div className="flex items-center gap-2 text-[#003366] font-bold text-lg">
                                <Wallet className="w-4 h-4 text-gray-400" />
                                {formatCurrency(profile.salary)}
                            </div>
                        </div>
                         <div className="group p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all">
                            <label className="text-xs text-gray-500 block mb-1">Bank Account</label>
                            <div className="flex items-center gap-2 text-gray-900 font-mono font-medium">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                {profile.bankAccountNumber || 'Not Set'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
