export default async function postTrip(tripData, token) {
  const response = await fetch('/api/trips', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tripData),
  });

  if (!response.ok) {
     const errorData = await response.json().catch(() => ({}));
     throw new Error(errorData.message || 'Failed to create trip');
  }

  return response.json();
}
