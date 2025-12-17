export default async function getReimbursementMe(token) {
  const response = await fetch("/api/reimbursement/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  const res = await response.json();

  console.log(res.data);

  if (!response.ok) {
    const errorData = {
      status: res.status || response.status,
      message: res.message || "Data not Received",
    };
    throw errorData;
  }

  return res.data;
}