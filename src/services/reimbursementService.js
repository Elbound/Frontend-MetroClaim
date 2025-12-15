
const reimbursementService = {
    getMyReimbursements: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 'r1', status: 'FinanceApproved', totalAmount: 1200000, date: '2025-12-01' },
                    { id: 'r2', status: 'Pending', totalAmount: 450000, date: '2025-12-10' },
                    { id: 'r3', status: 'Rejected', totalAmount: 100000, date: '2025-11-20' },
                ]);
            }, 800);
        });
    }
};

export default reimbursementService;
