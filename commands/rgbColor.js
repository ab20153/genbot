const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { randInt } = require("../rand.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rgbcolor")
        .setDescription(
            "Provides info about a color (defined by its red, green, blue values) or generates one randomly."
        )
        .addIntegerOption((option) =>
            option
                .setName("red")
                .setDescription(
                    "Custom amount of red in the color, randomized by default."
                )
                .setMinValue(0)
                .setMaxValue(255)
        )
        .addIntegerOption((option) =>
            option
                .setName("green")
                .setDescription(
                    "Custom amount of green in the color, randomized by default."
                )
                .setMinValue(0)
                .setMaxValue(255)
        )
        .addIntegerOption((option) =>
            option
                .setName("blue")
                .setDescription(
                    "Custom amount of blue in the color, randomized by default."
                )
                .setMinValue(0)
                .setMaxValue(255)
        ),
    async execute(interaction) {
        // Get the color's red value, randomize if not provided.
        const redValue =
            interaction.options.getInteger("red") ?? randInt(0, 255);
        // Get the color's green value, randomize if not provided.
        const greenValue =
            interaction.options.getInteger("green") ?? randInt(0, 255);
        // Get the color's blue value, randomize if not provided.
        const blueValue =
            interaction.options.getInteger("blue") ?? randInt(0, 255);
        const rgb = [redValue, greenValue, blueValue];
        // Convert the RGB values to hexadecimal
        // (attach 0 in front if a single digit number is received)
        const hexr =
            redValue.toString(16).length == 1
                ? "0" + redValue.toString(16)
                : redValue.toString(16);
        const hexg =
            greenValue.toString(16).length == 1
                ? "0" + greenValue.toString(16)
                : greenValue.toString(16);
        const hexb =
            blueValue.toString(16).length == 1
                ? "0" + blueValue.toString(16)
                : blueValue.toString(16);
        //Build the color's hex code
        const hex = `#${hexr}${hexg}${hexb}`;

        // Build an embed message to display the color,
        // its hex code and its RGB values
        const colorInfoEmbed = new EmbedBuilder()
            .setColor([redValue, greenValue, blueValue])
            .setTitle("Color")
            .addFields(
                {
                    name: "Color Hex Code",
                    value: hex,
                },
                {
                    name: "Color RGB Values",
                    value: `[${rgb.toString()}]`,
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [colorInfoEmbed],
        });
    },
};
