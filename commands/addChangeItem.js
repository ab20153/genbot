const { SlashCommandBuilder, bold } = require("discord.js");
const { addChangeItem } = require("../currencyUtils.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addchangeitem")
        .setDescription(
            "Edits a shop item or adds a new one if it doesn't exist."
        )
        .addStringOption((option) =>
            option
                .setName("itemname")
                .setDescription("Name of the item to add or change.")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("cost")
                .setDescription("Cost the item should have.")
                .setMinValue(1)
                .setMaxValue(9999999999)
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const itemName = interaction.options.getString("itemname");
        const cost = interaction.options.getInteger("cost");

        await addChangeItem(itemName, cost);

        await interaction.editReply(
            `${itemName} now costs ${bold(cost)} :coin:.`
        );
    },
};
