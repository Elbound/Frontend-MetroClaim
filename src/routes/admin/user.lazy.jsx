import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import getUsers from '@/api/user/getUsers';
import getManagers from '@/api/user/getManagers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Loader2, User, Shield, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import UserDetail from '@/components/UserDetail';

export const Route = createLazyFileRoute('/admin/user')({
  component: AdminUserPage,
});

function AdminUserPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Sheet State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fetchData = async () => {
    if (!currentUser?.tk) return;
    setLoading(true);
    try {
      const [usersData, managersData] = await Promise.all([
          getUsers(currentUser.tk),
          getManagers(currentUser.tk)
      ]);
      setUsers(usersData);
      setManagers(managersData);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser?.tk]);

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setIsSheetOpen(true);
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="w-full p-6 min-h-screen bg-gray-50/50 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">User Management</h1>
        <p className="text-gray-500">Manage employee accounts, roles, and details.</p>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-4 border-b border-gray-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-[#003366] flex items-center gap-2">
                <User className="w-5 h-5" /> Registered Users
              </CardTitle>
              <CardDescription className="mt-1">
                Total {users.length} users in the system.
              </CardDescription>
            </div>
            <Link to="/admin/create-user">
                <Button className="bg-[#003366] hover:bg-blue-800 text-white shadow-md">
                    Add New User
                </Button>
            </Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 border-b border-gray-100">
                <TableHead className="w-[30%] py-4 pl-6 font-semibold text-[#003366]">Employee</TableHead>
                <TableHead className="w-[20%] py-4 font-semibold text-[#003366]">Role</TableHead>
                <TableHead className="w-[25%] py-4 font-semibold text-[#003366]">Employee ID</TableHead>
                <TableHead className="w-[15%] py-4 font-semibold text-[#003366] text-right">Joined Date</TableHead>
                {/* <TableHead className="w-[10%] py-4 text-right pr-6"></TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <Loader2 className="animate-spin h-6 w-6 text-gray-400 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <TableRow
                    key={u.id}
                    onClick={() => handleRowClick(u)}
                    className="cursor-pointer hover:bg-blue-50/50 transition-colors border-b border-gray-50"
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full border border-gray-200 bg-blue-50 flex items-center justify-center text-[#003366] font-bold text-xs shrink-0">
                          {getInitials(u.fullName)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{u.fullName}</span>
                          <span className="text-xs text-gray-500 font-mono">{u.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-wrap gap-1">
                        {u.roles && u.roles.length > 0 ? (
                            u.roles.map((role, idx) => (
                                <Badge key={idx} variant={role === 'Manager' ? 'default' : 'secondary'} className="text-xs font-normal">
                                    {role}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-gray-400 text-xs italic">No roles</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="font-medium text-gray-700">ID:</span> {u.employeeId}
                            </div>
                            {u.managerId && (
                                <div className="flex items-center gap-2 text-xs text-blue-600">
                                    <Shield className="w-3 h-3" /> Has Manager
                                </div>
                            )}
                        </div>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                        <span className="text-sm text-gray-600">
                            {u.createdAt ? format(new Date(u.createdAt), 'dd MMM yyyy') : '-'}
                        </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No users found.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
            {selectedUser && (
                <UserDetail 
                    user={{
                        ...selectedUser, 
                        managerName: managers.find(m => m.id === selectedUser.managerId)?.fullName 
                    }} 
                    onClose={() => setIsSheetOpen(false)} 
                />
            )}
        </SheetContent>
      </Sheet>


    </div>
  );
}
