const { SlashCommandBuilder, inlineCode } = require("discord.js");
const { randInt } = require("../rand.js");

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
        const count = interaction.options.getInteger("count") ?? 1;
        const coin = ["Heads", "Tails"];

        let result = inlineCode(coin[randInt(0, 1)]);
        for (let i = 1; i < count; i++) {
            result += ` ${inlineCode(coin[randInt(0, 1)])}`;
        }

        await interaction.reply(result);
    },
};
