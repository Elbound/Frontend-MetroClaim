
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
    }
};

export default userService;
