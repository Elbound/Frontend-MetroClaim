export default async function getSubordinates(token) {
  const response = await fetch('/api/user/subordinates', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // It's possible a user has no subordinates or the endpoint returns 404/Empty.
    // Assuming empty list on 404 is safe, or let it throw if strict.
    // Let's assume strict for now, but catch in the component.
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch subordinates');
  }

  const result = await response.json();
  return result.data || [];
}
