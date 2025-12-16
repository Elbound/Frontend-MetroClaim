export default async function postCategory(categoryId, token) {
    console.log("token sent: " + token)
    const response = await fetch("/api/user-limit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ categoryId })
  });

  const res = await response.json();

//   console.log(res.data);

  if (!response.ok) {
    throw new Error(res.Message || "Data not Recieved");
  }

  return res.data;
}