export default async function getTripManager(token, page = 1, limit = 10) {
  let response;
  try {
    response = await fetch('/api/trips/manager', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Page': page,
        'X-Limit': limit,
      },
    });
  } catch (e) {
    throw { status: 503, message: 'Server unreachable' };
  }

  if (!response.ok) {
    let msg = response.statusText;
    try {
      const res = await response.json();
      msg = res.message || res.Message || msg;
    } catch (e) {}
    throw { status: response.status, message: msg };
  }

  const res = await response.json();
  const total = parseInt(response.headers.get('X-Total-Count') || '0', 10);

  return {
    data: res.data || [],
    meta: {
      total,
      page,
      limit
    }
  };
}
