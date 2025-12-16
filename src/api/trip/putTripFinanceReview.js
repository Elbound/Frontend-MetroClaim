import { format } from "date-fns";

export default async function putTripFinanceReview(id, data, token) {
  const response = await fetch(`/api/trips/${id}/finance-review`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();

  if (!response.ok) {
    throw new Error(res.Message || "Update failed");
  }

  return res;
}
