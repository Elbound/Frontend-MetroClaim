export default async function postCategory(token, categoryData) {
  let response;
  try {
    response = await fetch('/api/category', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
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
  return res.data;
}
