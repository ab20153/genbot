const { SlashCommandBuilder, inlineCode } = require("discord.js");
const { randInt } = require("../rand.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rand")
        .setDescription(`Provides a random number.`)
        .addIntegerOption((option) =>
            option
                .setName("min")
                .setDescription(
                    "The smallest allowed integer (inclusive; between -9,999,999,999 and 9,999,999,999; 1 by default)"
                )
                .setMinValue(-9999999999)
                .setMaxValue(9999999999)
        )
        .addIntegerOption((option) =>
            option
                .setName("max")
                .setDescription(
                    "The largest allowed integer (inclusive; between -9,999,999,999 and 9,999,999,999; 100 by default)"
                )
                .setMinValue(-9999999999)
                .setMaxValue(9999999999)
        )
        .addIntegerOption((option) =>
            option
                .setName("count")
                .setDescription(
                    "How many numbers to generate (between 1 and 32; 1 by default)"
                )
                .setMinValue(1)
                .setMaxValue(32)
        ),
    async execute(interaction) {
        // Get the min number.
        const min = interaction.options.getInteger("min") ?? 1;
        // Get the max number.
        const max = interaction.options.getInteger("max") ?? 100;
        // Get how many numbers should be generated.
        const count = interaction.options.getInteger("count") ?? 1;
        const diff = max - min;

        // If the min number is larger than max number, inform the user.
        if (diff < 0) {
            await interaction.reply({
                content: "The minimum should be smaller than maximum.",
                ephemeral: true,
            });
            return;
        }

        let result = "";
        // Randomize 1 number if 1 number requested.
        if (count == 1) {
            result = `**Random number (${min} to ${max}):**\n${inlineCode(
                randInt(min, max)
            )}`;
        }
        // Randomize multiple numbers if multiple numbers requested.
        else {
            result = `**${count} random numbers (${min} to ${max}):**\n${inlineCode(
                randInt(min, max)
            )}`;
            for (let i = 1; i < count; i++) {
                result += ` ${inlineCode(randInt(min, max))}`;
            }
        }

        await interaction.reply(result);
    },
};
