const { SlashCommandBuilder } = require("discord.js");
const { currencyUtils } = require("../currencyUtils.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getBalance")
        .setDescription("Retreives a server member's current balance.")
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("The member to check.")
        ),
    async execute(interaction) {
        const member = interaction.options.getMember("member") ?? interaction.member;
        
        const balance = currencyUtils.getBalance(member.id);

        await interaction.reply(`${member} has ${balance}`);
    },
};
