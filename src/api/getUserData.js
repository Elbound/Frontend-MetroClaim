export default async function getUserData(token) {
  const response = await fetch("/api/user/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  const res = await response.json();

  console.log(res.data);

  if (!response.ok) {
    throw new Error(res.Message || "Data not Recieved");
  }

  return res.data;
}