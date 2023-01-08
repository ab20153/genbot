const { SlashCommandBuilder, bold } = require("discord.js");
const { addBalance } = require("../currencyUtils.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addbalance")
        .setDescription("Add coins to a server member's balance.")
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription(
                    "How many coins to add. (negative amount will remove coins instead)"
                )
                .setMinValue(-9999999999)
                .setMaxValue(9999999999)
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription(
                    "The member to add coins to. (add to self by default)"
                )
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const member =
            interaction.options.getUser("member") ?? interaction.member;
        const amount = interaction.options.getInteger("amount");
        const title = amount >= 0 ? "added" : "removed";
        
        await addBalance(member.id, amount);

        await interaction.editReply(`${bold(amount)} :coin: ${title} to ${member}.`);
    },
};
