const { SlashCommandBuilder } = require("discord.js");
const CurrencyUtils = require("../currencyUtils.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription(
            "Earn 200 coins. Can be run once per day."
        ),
    async execute(interaction) {
        if(interaction.client.cooldowns.has(interaction.user.id)){
            return await interaction.reply({ content: "You already collected your daily coins. Try again once 24 hours have passed.", ephemeral: true });
        }

        CurrencyUtils.addBalance(interaction.user.id,200);
        await interaction.reply(`You've collected your 200 coins!`)

        interaction.client.cooldowns.set(interaction.user.id, true);
        setTimeout(() => { client.cooldowns.delete(interaction.user.id); }, 86400000 );
    },
};
