export default async function getLimit(token) {
  const response = await fetch("/api/user-limit", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  const res = await response.json();

  // console.log(res.data);

  if (!response.ok) {
    throw new Error(res.Message || "Data not Recieved");
  }

  return res.data;
}