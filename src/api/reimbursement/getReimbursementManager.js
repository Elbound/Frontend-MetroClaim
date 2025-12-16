export default async function getReimbursementManager(token) {
  const response = await fetch('/api/reimbursement/manager', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch manager reimbursements');
  }

  const result = await response.json();
  return result.data; // Assuming structure { status, message, data: [...] }
}
