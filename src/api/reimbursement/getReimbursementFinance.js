export default async function getReimbursementFinance(token) {
  let response;

  try {
    response = await fetch('/api/reimbursement/finance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch{
    console.error('<<<<<<<<Error fetching data:', response.status);
    throw {
      status: 503,
      message: 'Service Unavailable: Could not connect to the server.',
    };
  }

  console.log(response.status);
  console.log(response.statusText);

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const text = await response.text();
      if (text) {
        const json = JSON.parse(text);
        errorMessage = json.message || errorMessage;
      }
    } catch (e) {}

    throw { status: response.status, message: errorMessage };
  }

  return (await response.json()).data;
}
