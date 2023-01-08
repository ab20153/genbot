const { SlashCommandBuilder } = require("discord.js");
const { addBalance, getBalance } = require("../currencyUtils.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("givebalance")
        .setDescription("Gives another member some of your coins.")
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
                .setDescription("The member to give coins to.")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const member = interaction.options.getMember("member");
        const amount = interaction.options.getInteger("amount");
        const currentBalance = getBalance(interaction.member.id);

        if (amount > currentBalance) {
            return interaction.editReply(
                `Sorry ${interaction.user}, you only have ${currentAmount} :coin:.`
            );
        }

        addBalance(interaction.user.id, -amount);
        addBalance(member.id, amount);

        return interaction.editReply(
            `Successfully transferred ${amount} :coin: to ${member}. Your current balance is ${CurrencyUtils.getBalance(
                interaction.member.id
            )} :coin:.`
        );
    },
};
