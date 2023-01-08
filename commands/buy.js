const { SlashCommandBuilder } = require("discord.js");
const { addBalance, addItem, getBalance } = require("../currencyUtils.js");
const { Users, CurrencyShop } = require("../dbObjects.js");
const { Op } = require("sequelize");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item.")
        .addStringOption((option) =>
            option
                .setName("itemname")
                .setDescription("The item you wish to buy.")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        // Get name of the item bought.
        const itemName = interaction.options.getString("itemname");
        // Find the item in CurrencyShop table
        const item = await CurrencyShop.findOne({
            where: { name: { [Op.like]: itemName } },
        });

        // If item not found or is marked as deleted, inform the buyer
        if (!item || item.deleted ){
            return interaction.editReply(`That item doesn't exist.`);
        }

        // If the buyer lacks the funds to buy the item, inform them.
        if (item.cost > getBalance(interaction.member.id)) {
            return interaction.editReply(
                `You currently have ${getBalance(
                    interaction.member.id
                )}, but the ${item.name} costs ${item.cost}!`
            );
        }

        // Fetch the buyer from the database
        const user = await Users.findOne({
            where: { user_id: interaction.member.id },
        });

        await addBalance(interaction.member.id, -item.cost);
        await addItem(user, item);

        return interaction.editReply(`You've bought: ${item.name} for ${item.cost} :coin:.`);
    },
};
