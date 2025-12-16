export default async function getTripManager(token) {
  const response = await fetch('/api/trips/manager', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch manager trips');
  }

  const result = await response.json();
  return result.data || [];
}
