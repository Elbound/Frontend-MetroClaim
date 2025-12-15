
const categoryService = {
    getAll: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: '1', name: 'Transport' },
                    { id: '2', name: 'Meal' },
                    { id: '3', name: 'Office Supplies' },
                    { id: '4', name: 'Accommodation' },
                    { id: '5', name: 'Entertainment' },
                ]);
            }, 500);
        });
    }
};

export default categoryService;
