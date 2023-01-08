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

        const options = interaction.options.getString("options");
        const optionsArr = options.split(";");
        const optionsCount = optionsArr.length;
        const count = interaction.options.getInteger("count");

        if (optionsCount < 2) {
            await interaction.reply(
                "At least 2 options required (separate options using `;`)"
            );
            return;
        }

        let result = `**I choose:**\n${inlineCode(
            optionsArr[randInt(0, optionsCount - 1)]
        )}`;

        for (let i = 1; i < count; i++) {
            result += `\n${inlineCode(
                optionsArr[randInt(0, optionsCount - 1)]
            )}`;
        }

        await interaction.editReply(result);
    },
};
