const { SlashCommandBuilder } = require("discord.js");
const currencyUtils = require("../currencyUtils.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getbalance")
        .setDescription("Retreives a server member's current balance.")
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("The member whose balance to retreive.")
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const member =
            interaction.options.getMember("member") ?? interaction.member;
        const balance = currencyUtils.getBalance(member.id);

        await interaction.editReply({ content: `${member} has ${balance} :coin:.`, ephemeral: true });
    },
};
