
export default async function getPagedData(page, token, path, params = {}) {
  let response;
  try {
    const url = new URL(`/api/${path}/${page}`, window.location.origin);
    Object.keys(params).forEach(key => {
        if (params[key] && params[key] !== 'all') {
            url.searchParams.append(key, params[key]);
        }
    });

    response = await fetch(url.toString(), {
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
      msg = res.message || msg;
    } catch (e) {}
    throw { status: response.status, message: msg };
  }
  const totalPage = response.headers.get("X-Total-Pages");

//   console.log(response);
  console.log("===========totalpage: " +totalPage);
  const res = await response.json();
  console.log(res);
  return {
    data: res.data,
    pages: parseInt(totalPage)
  };
}