import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, RefreshCcw, CheckCircle2 } from 'lucide-react';
import getReimbursementManager from '@/api/reimbursement/getReimbursementManager';
import { useAuth } from '@/hooks/AuthContext';
import getReimbursementManagerHistory from '@/api/reimbursement/getReimbursementManagerHistory';
import getReimbursementById from '@/api/reimbursement/getReimbursementById';

export default function ManagerRevisionTracker() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [revisionState, setRevisionState] = useState({
    pendingRevision: 0, // Employee hasn't fixed it yet
    finishRevision: 0,  // Employee fixed it, Manager needs to look again
  });

  useEffect(() => {
  const fetchData = async () => {
    if (!user?.tk) return;
    try {
      setLoading(true);

      const summaryData = await getReimbursementManagerHistory(user.tk);

      if (!summaryData || summaryData.length === 0) {
        setRevisionState({ pendingRevision: 0, finishRevision: 0 });
        return;
      }

      const detailedRequests = await Promise.all(
        summaryData.map(item => getReimbursementById(item.id, user.tk))
      );

      const pending = detailedRequests.filter(
        (r) => r.logs?.[0]?.action === 'ManagerRevision'
      ).length || 0;

      const finished = detailedRequests.filter(
        (r) => r.logs?.[0]?.action !== "ManagerRevision" && 
               r.logs?.[1]?.action === 'ManagerRevision'
      ).length || 0;

      setRevisionState({
        pendingRevision: pending,
        finishRevision: finished,
      });

    } catch (err) {
      console.error("Revision Tracker Error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [user?.tk]);

  if (loading) {
    return <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-xl"><Loader2 className="animate-spin text-muted-foreground" /></div>;
  }

  return (
    <Card className="border-none bg-slate-50 dark:bg-slate-900/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" />
          Revision Lifecycle
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* State 1: Awaiting Employee */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full">
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold">Awaiting Team Fixes</p>
              <p className="text-[10px] text-muted-foreground font-medium">Items currently with employees</p>
            </div>
          </div>
          <div className="text-xl font-black text-amber-600">{revisionState.pendingRevision}</div>
        </div>

        {/* State 2: Ready for Manager Re-review */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold">Ready to Re-approve</p>
              <p className="text-[10px] text-muted-foreground font-medium">Updated by team, needs your check</p>
            </div>
          </div>
          <div className="text-xl font-black text-blue-600">{revisionState.finishRevision}</div>
        </div>
      </CardContent>
    </Card>
  );
}