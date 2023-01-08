const { SlashCommandBuilder, inlineCode } = require("discord.js");
const { randInt } = require("../rand.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("choose")
        .setDescription("Picks one of provided options.")
        .addStringOption((option) =>
            option
                .setName("options")
                .setDescription("The options to choose from (separate with ;)")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("count")
                .setDescription(
                    "How many times to choose (between 1 and 32; 1 by default; duplicates permitted)"
                )
                .setMinValue(1)
                .setMaxValue(32)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        // Get the string of options and split it into an array.
        const options = interaction.options.getString("options");
        const optionsArr = options.split(";");
        // Get the number of options.
        const optionsCount = optionsArr.length;
        // Get how many options should be returned.
        const count = interaction.options.getInteger("count");

        // If the options are too few, inform the user.
        if (optionsCount < 2) {
            await interaction.reply(
                "At least 2 options required (separate options using `;`)"
            );
            return;
        }

        // Start building the result to be returned.
        let result = `**I choose:**\n${inlineCode(
            optionsArr[randInt(0, optionsCount - 1)]
        )}`;

        // Re-randomize if user asked to choose multiple times.
        for (let i = 1; i < count; i++) {
            result += `\n${inlineCode(
                optionsArr[randInt(0, optionsCount - 1)]
            )}`;
        }

        await interaction.editReply(result);
    },
};
