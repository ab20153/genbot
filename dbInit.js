const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.sqlite",
});

const CurrencyShop = require("./models/CurrencyShop.js")(
    sequelize,
    Sequelize.DataTypes
);
require("./models/Users.js")(sequelize, Sequelize.DataTypes);
require("./models/UserItems.js")(sequelize, Sequelize.DataTypes);

const force = process.argv.includes("--force") || process.argv.includes("-f");

// Initialize database tables.
sequelize
    .sync({ force })
    .then(async () => {
        // Add an item to the shop.
        const shop = [CurrencyShop.upsert({ name: "Fishing Rod", cost: 50 })];

        await Promise.all(shop);
        console.log("Database synced");

        sequelize.close();
    })
    .catch(console.error);
