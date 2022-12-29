const { SlashCommandBuilder } = require("discord.js");
const { currencyUtils } = require("../currencyUtils.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addBalance")
        .setDescription("Adds a custom amount to a server member's balance.")
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("How much to add.")
                .setMinValue(-9999999999)
                .setMaxValue(9999999999)
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("The member to add currency to.")
        ),
    async execute(interaction) {
        const member = interaction.options.getMember("member") ?? interaction.member;
        const amount = interaction.options.getInteger("amount");
        
        currencyUtils.addBalance(member.id, amount);

        await interaction.reply(`${amount} added to ${member}`);
    },
};
