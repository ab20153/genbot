const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Rand = require("../rand.js");

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
        let hex = interaction.options.getString("hex");
        if (hex) {
            rgb = [
                parseInt(hex.substring(0, 2), 16),
                parseInt(hex.substring(2, 4), 16),
                parseInt(hex.substring(4), 16),
            ];
            hex = "#" + hex;
        } else {
            const redValue = Rand.randInt(0, 255);
            const greenValue = Rand.randInt(0, 255);
            const blueValue = Rand.randInt(0, 255);
            rgb = [redValue, greenValue, blueValue];
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
            hex = `#${hexr}${hexg}${hexb}`;
        }

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
