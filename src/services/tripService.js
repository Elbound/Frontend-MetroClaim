const tripService = {
  getTrips: async (token) => {
    const response = await fetch('/api/trips', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
       // Fallback to empty list or throw error, depending on preference.
       // For now, let's return empty if 404, or throw.
       if(response.status === 404) return [];
       throw new Error('Failed to fetch trips');
    }
    
    const result = await response.json();
    return result.data || []; // Assuming standard response format { data: [...] }
  },

  createTrip: async (tripData, token) => {
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
};

export default tripService;
