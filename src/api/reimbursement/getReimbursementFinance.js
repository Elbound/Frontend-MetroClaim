export default async function getReimbursementFinance(token) {
  let response;

  try {
    response = await fetch('/api/reimbursement/finance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
  } catch (networkError) {
    // 🛑 This runs if the fetch fails instantly (e.g., Server is DEAD or DB disconnect caused a timeout)
    throw {
      status: 503,
      message: 'Service Unavailable: Could not connect to the server.'
    };
  }

  // --- Now 'response' is safe to use ---
  
  // If the server is alive but returned an error (401, 404, 500)
  if (!response.ok) {
    let errorMessage = response.statusText || 'Error fetching data';
    
    try {
      // Try to get a better message from the JSON body if it exists
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If body is empty (common in 401s), we just keep the statusText
    }

    throw {
      status: response.status,
      message: errorMessage
    };
  }

  const result = await response.json();
  return result.data; 
}