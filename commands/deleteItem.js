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

        if (
            !interaction.member.roles.cache.some(
                (role) => role.name === "Admin"
            )
        ) {
            return await interaction.editReply({
                content: "You can't run the command - missing Admin role.",
                ephemeral: true,
            });
        }

        const itemName = interaction.options.getString("itemname");

        await deleteItem(itemName);

        await interaction.editReply(`${itemName} is no longer up for sale.`);
    },
};
