export default async function getReimbursementFinanceHistory(token) {
  const response = await fetch('/api/reimbursement/finance/history', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const res = await response.json();

  if (!response.ok) {
    throw new Error(res.message || 'Failed to fetch finance history');
  }

  return res.data;
}
