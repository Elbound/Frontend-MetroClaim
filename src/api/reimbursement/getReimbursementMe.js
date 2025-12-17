export default async function getReimbursementMe(token) {
  let response;

  try {
    response = await fetch("/api/reimbursement/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
  } catch (networkError) {
    throw { status: 503, message: "Service Unavailable: Server is offline" };
  }

  if (!response.ok) {
    let errorMessage = "Data not Received";
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (parseError) {
      errorMessage = response.statusText || errorMessage;
    }

    throw {
      status: response.status,
      message: errorMessage,
    };
  }

  const res = await response.json();
  console.log("Fetched Data:", res.data);
  return res.data;
}