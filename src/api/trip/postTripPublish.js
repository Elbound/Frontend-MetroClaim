export default async function postTripPublish(tripId, token) {
  const response = await fetch(`/api/trips/${tripId}/publish`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to publish trip');
  }

  return response.json();
}
