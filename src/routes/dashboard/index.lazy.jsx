import { createLazyFileRoute, Outlet } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import SummaryWidget from '@/components/dashboard/SummaryWidget';
import ActiveLimitsWidget from '@/components/dashboard/ActiveLimitsWidget';
import { router } from '@/router';
import OngoingTripWidget from '@/components/dashboard/OngoingTripWidget';
import LimitChartWidget from '@/components/dashboard/LimitChartWidget';
import { useAuth } from '@/hooks/AuthContext';
import getCategory from '@/api/getCategory';
import getLimit from '@/api/limit/getLimit';
import getTripAssigned from '@/api/trip/getTripAssigned';
import getTripAssignedReimbursement from '@/api/trip/getTripAssignedReimbrusement';
import getReimbursementById from '@/api/reimbursement/getReimbursementById';
import getUserData from '@/api/getUserData';
import getReimbursementMe from '@/api/reimbursement/getReimbursementMe';

export const Route = createLazyFileRoute('/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [limits, setLimits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState(null);
  const [reimbursementStats, setReimbursementStats] = useState({
    lastAmount: 0,
    lastApprovedAmount: 0,
    lastRejectedAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [summaryIsLoading, setSummaryIsLoading] = useState(true);

  const fetchCategory = async () => {
    setLoading(true);
    const response = await getCategory(user.tk);

    setCategories(response);
  };

  const fetchLimit = async () => {
    setLoading(true);
    const response = await getLimit(user.tk);

    setLimits(response);
    setLoading(false);
  };

  const fetchTrips = async () => {
    const data = await getTripAssigned(user.tk);

    const ongoingOnly = Array.isArray(data) ? data.filter((t) => t.status === 'Ongoing') : [];

    const tripPlus = await Promise.all(
      ongoingOnly.map(async (trip) => {
        const rId = await getTripAssignedReimbursement(trip.id, user.tk);
        const reimb = await getReimbursementById(rId, user.tk);
        const latestStatus = reimb.logs[0].action || 'No Status';

        return { ...trip, reimbursementId: rId, reimbursementStatus: latestStatus };
      })
    );

    setTrips(tripPlus);
  };

  const fetchData = async () => {
    const [userData, reimbursements] = await Promise.all([
      getUserData(user.tk),
      getReimbursementMe(user.tk),
    ]);

    setData(userData);

    if (reimbursements && Array.isArray(reimbursements)) {
      // Sort by date descending (newest first)
      const sorted = [...reimbursements].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const lastReimb = sorted[0];
      const lastApproved = sorted.find((r) => r.status === 'Approved');
      const lastRejected = sorted.find((r) => r.status === 'Rejected');

      setReimbursementStats({
        lastAmount: lastReimb ? lastReimb.totalAmount : 0,
        lastApprovedAmount: lastApproved ? lastApproved.totalAmount : 0,
        lastRejectedAmount: lastRejected ? lastRejected.totalAmount : 0,
      });
    }
  };

  useEffect(() => {
    if (!user?.tk) return;
    setLoading(true);
    try {
      fetchCategory();
      fetchLimit();
      fetchTrips();
      fetchData();
    } catch (error) {
      router.navigate({
        to: '/error',
        replace: true,
        search: {
          status: error.status || 500,
          msg: error.message || 'An unexpected error occurred.',
        },
      });
    } finally {
      setLoading(false);
    }
  }, [user?.tk]);

  const handleCategoryClick = (limit) => {
    // console.log(limit.categoryName);
    router.navigate({
      to: '/reimbursement',
      search: {
        categoryId: limit.categoryId,
        categoryName: limit.categoryName,
      },
    });
  };
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mt-6">
        <SummaryWidget userData={data} statsData={reimbursementStats} summaryLoading={loading} />
      </div>
      <div className="mt-8">
        <ActiveLimitsWidget
          onQuickClaim={handleCategoryClick}
          limitsData={limits}
          categoriesData={categories}
          activeLimitLoading={loading}
        />
      </div>
      <div className="mt-6">
        <OngoingTripWidget tripPlusData={trips} ongoingTripLoading={loading} />
      </div>
      <div className="mt-4">
        <LimitChartWidget limitsData={limits} limitChartLoading={loading} />
      </div>
    </div>
  );
}
