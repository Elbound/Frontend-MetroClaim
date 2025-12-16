
const userLimitService = {
    getMyLimits: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 'l1', categoryId: '1', categoryName: 'Transport', remainingBalance: 1500000, limitAmount: 2000000 },
                    { id: 'l2', categoryId: '2', categoryName: 'Meal', remainingBalance: 500000, limitAmount: 1000000 },
                    { id: 'l3', categoryId: '3', categoryName: 'Office Supplies', remainingBalance: 250000, limitAmount: 500000 },
                ]);
            }, 700);
        });
    },
    generateLimit: async (categoryId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: "Limit generated" });
            }, 1000);
        });
    }
};

export default userLimitService;
