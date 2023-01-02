const { SlashCommandBuilder } = require("discord.js");
const CurrencyUtils = require("../currencyUtils.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addbalance")
        .setDescription("Adds a custom amount to a server member's balance.")
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("How much to add, remove balance by adding a negative value.")
                .setMinValue(-9999999999)
                .setMaxValue(9999999999)
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("The member to add currency to. (add to self by default)")
        ),
    async execute(interaction) {
        const member = interaction.options.getUser("member")
            ?? interaction.member;
        const amount = interaction.options.getInteger("amount");
        
        CurrencyUtils.addBalance(member.id, amount);

        await interaction.reply(`${amount} added to ${member}`);
    },
};
