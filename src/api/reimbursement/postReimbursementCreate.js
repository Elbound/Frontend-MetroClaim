export default async function postReimbursementCreate(item) {
  const response = await fetch("/api/reimbursement", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({item }),
  });

  const res = await response.json();

  console.log(res);

  if (!response.ok || res.status !== 200) {
    throw new Error(res.Message || "Login failed");
  }

  return res;
}