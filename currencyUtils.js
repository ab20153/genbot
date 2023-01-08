const { Collection } = require("discord.js");
const { Users, UserItems } = require("./dbObjects.js");
const currency = new Collection();

module.exports = {
    currency: currency,
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
    },
    async addItem(user, item) {
        const userItem = await UserItems.findOne({
            where: { user_id: user.user_id, item_id: item.id },
        });

        if (userItem) {
            userItem.amount += 1;
            return userItem.save();
        }

        return UserItems.create({
            user_id: user.user_id,
            item_id: item.id,
            amount: 1,
        });
    },
    getItems(user) {
        return UserItems.findAll({
            where: { user_id: user.user_id },
            include: ["item"],
        });
    },
};
