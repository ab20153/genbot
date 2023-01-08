const { Collection } = require("discord.js");
const { Users, UserItems, CurrencyShop } = require("./dbObjects.js");
const currency = new Collection();

module.exports = {
    // Collection storing the currencies of server members.
    currency: currency,

    // Function to add balance to a user.
    // id - id of the user
    // amount - amount to add
    async addBalance(id, amount) {
        const user = currency.get(id);

        // If the user exists in database, increase their balance.
        if (user) {
            user.balance += Number(amount);
            return user.save();
        }

        // If the user doesn't exist in database, add them and set their balance.
        const newUser = await Users.create({ user_id: id, balance: amount });
        currency.set(id, newUser);

        return newUser;
    },

    // Function to retreive a user's balance.
    // id - id of the user
    getBalance(id) {
        const user = currency.get(id);

        // If user was not found in database, they have no balance and 0 is returned.
        return user ? user.balance : 0;
    },

    // Function to add an item to the user's inventory.
    // user - the object of the user
    // item - the object of the item
    async addItem(user, item) {
        const userItem = await UserItems.findOne({
            where: { user_id: user.user_id, item_id: item.id },
        });

        // If the user already has the item, increase the amount of the item.
        if (userItem) {
            userItem.amount += 1;
            return userItem.save();
        }

        // If the user doesn't have the item, create new entry in UserItems table.
        return UserItems.create({
            user_id: user.user_id,
            item_id: item.id,
            amount: 1,
        });
    },

    // Function to get all items a user has.
    // user - the object of the user
    getItems(user) {
        return UserItems.findAll({
            where: { user_id: user.user_id },
            include: ["item"],
        });
    },

    // Function to add an item to the shop or update an item if it already exists.
    // itemName - name of the item to add or change
    // itemCost - cost the item should have
    async addChangeItem(itemName, itemCost) {
        const item = await CurrencyShop.findOne({
            where: { name: itemName },
        });

        // If the item exists in database, update its cost
        if (item) {
            item.cost = itemCost;
            // If the item has been deleted previously, mark it as not deleted anymore.
            item.deleted = false;
            return item.save();
        }

        // If the item doesn't exist in database, create it.
        return CurrencyShop.create({
            name: itemName,
            cost: itemCost,
        });
    },

    // Function to delete an item from the shop.
    // itemName - the item to be deleted
    async deleteItem(itemName) {
        const item = await CurrencyShop.findOne({
            where: { name: itemName },
        });

        // If item exists in databse, mark it as deleted
        if(item){
            item.deleted = true;
            return item.save();
        }
    },
};
