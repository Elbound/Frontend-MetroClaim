export default async function getLimit(token) {
  let response;
  try {
    response = await fetch("/api/user-limit", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
  } catch (e) {
    throw { status: 503, message: "Server unreachable" };
  }

  if (!response.ok) {
    let msg = response.statusText;
    try {
      const res = await response.json();
      msg = res.message || res.Message || msg;
    } catch (e) {}
    throw { status: response.status, message: msg };
  }

  const res = await response.json();
  return res.data;
}