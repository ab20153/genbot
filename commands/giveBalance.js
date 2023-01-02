const { SlashCommandBuilder } = require("discord.js");
const CurrencyUtils  = require("../currencyUtils.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("givebalance")
        .setDescription("Gives another member some of your balance.")
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("How much to give.")
                .setMinValue(1)
                .setMaxValue(9999999999)
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("The member to give currency to.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const member = interaction.options.getMember("member");
        const amount = interaction.options.getInteger("amount");
        const currentBalance = CurrencyUtils.getBalance(interaction.member.id);
        
        if (amount > currentBalance) return interaction.reply(`Sorry ${interaction.user}, you only have ${currentAmount}.`);

        CurrencyUtils.addBalance(interaction.user.id, -amount);
	    CurrencyUtils.addBalance(member.id, amount);

        return interaction.reply(`Successfully transferred ${amount} to ${member}. Your current balance is ${CurrencyUtils.getBalance(interaction.member.id)}`);
    },
};
