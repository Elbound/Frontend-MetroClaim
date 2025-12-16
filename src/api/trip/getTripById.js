export default async function getTripById(id, token) {
  const response = await fetch(`/api/trips/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch trip details');
  }

  const result = await response.json();
  return result.data;
}
