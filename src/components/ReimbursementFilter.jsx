import React from 'react';
import { Search, Filter as FilterIcon, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ReimbursementFilter({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter 
}) {
  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Drafted', label: 'Drafted' },
    { value: 'Submitted', label: 'Submitted' },
    { value: 'ManagerApproved', label: 'Manager Approved' },
    { value: 'ManagerRejected', label: 'Manager Rejected' },
    { value: 'ManagerRevision', label: 'Manager Revision' },
    { value: 'FinanceApproved', label: 'Finance Approved' },
    { value: 'FinanceRejected', label: 'Finance Rejected' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
             <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div className="w-full sm:w-[200px]">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full bg-white border-gray-200 shadow-sm text-sm">
             <div className="flex items-center gap-2 text-gray-600">
               <FilterIcon className="h-3.5 w-3.5" />
               <SelectValue placeholder="Filter by status" />
             </div>
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value} className="text-sm">
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
