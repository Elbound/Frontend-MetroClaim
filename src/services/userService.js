
const userService = {
    getMe: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: 'u1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    dueReimbursement: 750000
                });
            }, 600);
        });
    },
    getAll: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 'u1', name: 'John Doe', email: 'john@example.com' },
                    { id: 'u2', name: 'Jane Smith', email: 'jane@example.com' },
                    { id: 'u3', name: 'Bob Johnson', email: 'bob@example.com' },
                    { id: 'u4', name: 'Alice Williams', email: 'alice@example.com' },
                ]);
            }, 500);
        });
    }
};

export default userService;
