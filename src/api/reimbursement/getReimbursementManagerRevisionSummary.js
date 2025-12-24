const getReimbursementManagerRevisionSummary = async (token) => {
    const response = await fetch(`/api/reimbursement/manager/revision-summary`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  
    const json = await response.json();
    return json.data;
  };
  
  export default getReimbursementManagerRevisionSummary;
