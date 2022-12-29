const { SlashCommandBuilder } = require("discord.js");
const { currencyUtils } = require("../currencyUtils.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("giveBalance")
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
        const member = interaction.options.getMember("member") ?? interaction.member;
        const amount = interaction.options.getInteger("amount");
        const currentBalance = currencyUtils.getBalance(interaction.user.id);
        
        if (amount > currentBalance) return interaction.reply(`Sorry ${interaction.user}, you only have ${currentAmount}.`);

        currencyUtils.addBalance(interaction.user.id, -amount);
	    currencyUtils.addBalance(member.id, amount);

        return interaction.reply(`Successfully transferred ${amount} to ${member}. Your current balance is ${currencyUtils.getBalance(interaction.user.id)}`);
    },
};
