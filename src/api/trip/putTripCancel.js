export default async function putTripCancel(tripId, token) {
  const response = await fetch(`/api/trips/${tripId}/cancel`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to cancel trip');
  }

  return response.json();
}
