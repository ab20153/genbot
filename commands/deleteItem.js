const { SlashCommandBuilder, bold } = require("discord.js");
const { deleteItem } = require("../currencyUtils.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deleteitem")
        .setDescription("Removes an item from the shop.")
        .addStringOption((option) =>
            option
                .setName("itemname")
                .setDescription("Name of the item to be deleted.")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const itemName = interaction.options.getString("itemname");

        await deleteItem(itemName);

        await interaction.editReply(`${itemName} is no longer up for sale.`);
    },
};
