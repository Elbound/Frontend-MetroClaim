export default async function getReimbursementById(id, token) {
  const response = await fetch(`/api/reimbursement/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  // const res = await response.json();

  if (!response.ok) {
    throw new Error(res.Message || "Failed to fetch reimbursement details");
  }

  return res.data;
}
