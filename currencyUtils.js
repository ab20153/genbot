module.exports = {
    
    async addBalance(id, amount) {
        const user = currency.get(id);
    
        if (user) {
            user.balance += Number(amount);
            return user.save();
        }
    
        const newUser = await Users.create({ user_id: id, balance: amount });
        currency.set(id, newUser);
    
        return newUser;
    },
    getBalance(id) {
        const user = currency.get(id);
        return user ? user.balance : 0;
    }

};