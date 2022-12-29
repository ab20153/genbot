const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("Open the shop."),
    async execute(interaction) {
        const items = await CurrencyShop.findAll();
        return interaction.reply(codeBlock(items.map(i => `${i.name}: ${i.cost}`).join('\n')));
    },
};
