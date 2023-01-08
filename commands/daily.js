const { SlashCommandBuilder } = require("discord.js");
const { addBalance } = require("../currencyUtils.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Earn 200 coins. Can be run once per day."),
    async execute(interaction) {
        await interaction.deferReply();

        // Check if the cooldown for the user has run out yet
        if (interaction.client.cooldowns.has(interaction.user.id)) {
            return await interaction.editReply({
                content:
                    "You already collected your daily coins. Try again once 24 hours have passed.",
                ephemeral: true,
            });
        }

        await addBalance(interaction.user.id, 200);
        await interaction.editReply(`You've collected your 200 coins!`);

        // Add user to the cooldowns collection, remove them in 1 day
        interaction.client.cooldowns.set(interaction.user.id, true);
        setTimeout(() => {
            client.cooldowns.delete(interaction.user.id);
        }, 86400000); // 86400000 = milliseconds in a day
    },
};
