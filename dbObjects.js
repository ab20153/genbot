const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.sqlite",
});

const Users = require("./models/Users.js")(sequelize, Sequelize.DataTypes);
const CurrencyShop = require("./models/CurrencyShop.js")(
    sequelize,
    Sequelize.DataTypes
);
const UserItems = require("./models/UserItems.js")(
    sequelize,
    Sequelize.DataTypes
);

// Link UserItems table to the CurrencyShop table
UserItems.belongsTo(CurrencyShop, { foreignKey: "item_id", as: "item" });

module.exports = { Users, CurrencyShop, UserItems };
