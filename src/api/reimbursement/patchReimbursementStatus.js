export default async function patchReimbursementStatus(id, action, comment, token) {
  const response = await fetch(`/api/reimbursement/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ action, comment }),
  });

  if (!response.ok) {
     const errorData = await response.json().catch(() => ({}));
     throw new Error(errorData.message || "Failed to update reimbursement status");
  }

  return response.json();
}
