const { SlashCommandBuilder, inlineCode } = require("discord.js");
const { randInt } = require("../rand.js");

// Array that simulates a coin
const coin = ["Heads", "Tails"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Flips a coin.")
        .addIntegerOption((option) =>
            option
                .setName("count")
                .setDescription(
                    "How many coins to flip (between 1 and 32; 1 by default)"
                )
                .setMinValue(1)
                .setMaxValue(32)
        ),
    async execute(interaction) {
        // Get how many times coin should be flipped
        const count = interaction.options.getInteger("count") ?? 1;

        // Flip the coin
        let result = inlineCode(coin[randInt(0, 1)]);
        // Flip the coin some more times if the user asked to
        for (let i = 1; i < count; i++) {
            result += ` ${inlineCode(coin[randInt(0, 1)])}`;
        }

        await interaction.reply(result);
    },
};
