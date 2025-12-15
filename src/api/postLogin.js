export default async function postLogin(email, password) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({email, password }),
  });

  const res = await response.json();
  console.log(res);

  if (!response.ok || res.Status !== 200) {
    throw new Error(res.Message || "Login failed");
  }

  return res;
}