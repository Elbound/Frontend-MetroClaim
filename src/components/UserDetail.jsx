import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Shield, Building, CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Link } from "@tanstack/react-router";

export default function UserDetail({ user, onClose }) {
  if (!user) return null;

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
    }).format(amount);
  };

  return (
    <>
        <SheetHeader className="pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full border-2 border-white bg-[#003366] flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {getInitials(user.fullName)}
                </div>
                <div>
                    <SheetTitle className="text-2xl font-bold text-gray-900">{user.fullName}</SheetTitle>
                    <SheetDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                            {user.employeeId}
                        </Badge>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{user.email}</span>
                    </SheetDescription>
                </div>
            </div>
        </SheetHeader>

        <div className="py-0 space-y-6">
            <div className="space-y-4">                
                <div className="space-y-5 px-1">
                    <div>
                        <label className="text-xs text-gray-500 font-semibold uppercase block mb-1">Roles</label>
                        <div className="flex flex-wrap gap-1">
                            {user.roles?.map((r, i) => <Badge key={i} className="text-xs bg-[#003366]">{r}</Badge>)}
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-xs text-gray-500 font-semibold uppercase block mb-1">Joined Date</label>
                        <p className="text-sm font-medium text-gray-900">
                            {user.createdAt ? format(new Date(user.createdAt), 'dd MMMM yyyy') : '-'}
                        </p>
                    </div>

                    <Separator />

                    <div>
                            <label className="text-xs text-gray-500 font-semibold uppercase block mb-1">Manager</label>
                            <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {user.managerId ? (
                                <>
                                    <Shield className="w-3 h-3 text-green-600" />
                                    {user.managerName || user.managerId}
                                </>
                            ) : (
                                <span className="text-gray-400 italic">No Manager</span>
                            )}
                            </p>
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 font-semibold uppercase block mb-1">Bank Account</label>
                        <p className="text-sm font-medium font-mono text-gray-900">
                            {user.bankAccountNumber || 'Not Set'}
                        </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                        <label className="text-xs text-blue-600 font-semibold uppercase block mb-1">Current Salary</label>
                        <p className="text-lg font-bold text-[#003366]">
                            {formatCurrency(user.salary || 0)}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <SheetFooter className="gap-2 sm:gap-0 pt-6 border-t border-gray-100 mt-auto">
             <div className="flex w-full gap-2">
                 <Button variant="outline" className="flex-1" onClick={onClose}>
                    Close
                 </Button>
                 <Link to="/admin/update-user" search={{ id: user.id }} className="flex-1">
                    <Button className="w-full bg-[#003366] hover:bg-blue-800">
                        Edit Details
                    </Button>
                 </Link>
             </div>
        </SheetFooter>
    </>
  );
}

