const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { randInt } = require("../rand.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("hexcolor")
        .setDescription(
            "Provides info about a color (defined by its hex code) or generates one randomly."
        )
        .addStringOption((option) =>
            option
                .setName("hex")
                .setDescription(
                    "Hex code of the color (don't include the #), randomized by default."
                )
                .setMinLength(6)
                .setMaxLength(6)
        ),
    async execute(interaction) {
        // Get the provided hex code.
        let hex = interaction.options.getString("hex");
        
        // If hex code was provided, convert it to RGB values.
        if (hex) {

            // Is the hex code an actual color hex code?
            if (!/^[0-9a-fA-F]+$/.test(hex)) {
                return await interaction.reply(
                    `That doesn't look like a color hex code.`
                );
            }

            rgb = [
                parseInt(hex.substring(0, 2), 16),
                parseInt(hex.substring(2, 4), 16),
                parseInt(hex.substring(4), 16),
            ];
            hex = "#" + hex;
        }
        // If hex code was not provided, generate a color randomly.
        else {
            const redValue = randInt(0, 255);
            const greenValue = randInt(0, 255);
            const blueValue = randInt(0, 255);
            rgb = [redValue, greenValue, blueValue];
            // Convert redValue to hexadecimal.
            const hexr =
                redValue.toString(16).length == 1
                    ? "0" + redValue.toString(16)
                    : redValue.toString(16);
            // Convert greenValue to hexadecimal.
            const hexg =
                greenValue.toString(16).length == 1
                    ? "0" + greenValue.toString(16)
                    : greenValue.toString(16);
            // Convert blueValue to hexadecimal.
            const hexb =
                blueValue.toString(16).length == 1
                    ? "0" + blueValue.toString(16)
                    : blueValue.toString(16);
            // Assemble the color hex code string
            hex = `#${hexr}${hexg}${hexb}`;
        }

        // Build an embed message with the provided or generated color
        // as well as hex and RGB info for the color.
        const colorInfoEmbed = new EmbedBuilder()
            .setColor(hex)
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
