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

        // Get the member to give balance to.
        const member = interaction.options.getMember("member");
        // Get the amount to be given.
        const amount = interaction.options.getInteger("amount");
        // Get the giver's balance.
        const currentBalance = getBalance(interaction.member.id);

        // If the user who ran the command doesn't have
        // as much as they wish to give, inform them.
        if (amount > currentBalance) {
            return interaction.editReply(
                `Sorry ${interaction.user}, you only have ${currentAmount} :coin:.`
            );
        }

        addBalance(interaction.user.id, -amount);
        addBalance(member.id, amount);

        return interaction.editReply(
            `Successfully transferred ${amount} :coin: to ${member}. Your current balance is ${getBalance(
                interaction.member.id
            )} :coin:.`
        );
    },
};
