const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { randInt } = require("../rand.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Creates a quick poll.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("yesno")
                .setDescription("Poll asking a yes or no question.")
                .addStringOption((option) =>
                    option
                        .setName("question")
                        .setDescription("The question.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("compact")
                .setDescription(
                    "Poll asking a yes or no question, but the poll will not use embeds and take up less space."
                )
                .addStringOption((option) =>
                    option
                        .setName("question")
                        .setDescription("The question.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("multichoice")
                .setDescription("Poll asking to choose from 2 to 11 options.")
                .addStringOption((option) =>
                    option
                        .setName("question")
                        .setDescription("The question.")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option.setName("option1").setDescription("The question.")
                )
                .addStringOption((option) =>
                    option.setName("option2").setDescription("The question.")
                )
                .addStringOption((option) =>
                    option.setName("option3").setDescription("The question.")
                )
                .addStringOption((option) =>
                    option.setName("option4").setDescription("The question.")
                )
                .addStringOption((option) =>
                    option.setName("option5").setDescription("The question.")
                )
                .addStringOption((option) =>
                    option.setName("option6").setDescription("The question.")
                )
                .addStringOption((option) =>
                    option.setName("option7").setDescription("The question.")
                )
                .addStringOption((option) =>
                    option.setName("option8").setDescription("The question.")
                )
                .addStringOption((option) =>
                    option.setName("option9").setDescription("The question.")
                )
                .addStringOption((option) =>
                    option.setName("option10").setDescription("The question.")
                )
                .addStringOption((option) =>
                    option.setName("option0").setDescription("The question.")
                )
        ),
    async execute(interaction) {
        await interaction.deferReply();

        // Get the question.
        const question = interaction.options.getString("question");

        // poll compact
        if (interaction.options.getSubcommand() === "compact") {
            const poll = await interaction.editReply({
                content: question,
                fetchReply: true,
            });
            poll.react("👍");
            poll.react("👎");
            poll.react("🤷");
            return;
        }

        // Build embed message to store the question and options (if applicable)
        const pollEmbed = new EmbedBuilder()
            .setColor([
                randInt(0, 255),
                randInt(0, 255),
                randInt(0, 255),
            ])
            .setTitle(question)
            .setAuthor({
                name: `${interaction.member.user.tag} asks:`,
                iconURL: interaction.member.user.avatarURL(),
            })
            .setTimestamp();

        // poll yesno
        if (interaction.options.getSubcommand() === "yesno") {
            const poll = await interaction.editReply({
                embeds: [pollEmbed],
                fetchReply: true,
            });
            poll.react("👍");
            poll.react("👎");
            poll.react("🤷");
        }
        // poll multichoice
        else if (interaction.options.getSubcommand() === "multichoice") {
            let optionList = "";
            // array to fetch emotes from
            const emojis = [
                "0️⃣",
                "1️⃣",
                "2️⃣",
                "3️⃣",
                "4️⃣",
                "5️⃣",
                "6️⃣",
                "7️⃣",
                "8️⃣",
                "9️⃣",
                "🔟",
            ];
            // Array that will remember which options were used and which were not
            // (option0, option 1 etc)
            let helperArray = [];
            // Were there no options provided?
            let isEmpty = true;
            // Loop through options 0 to 10
            for (let i = 0; i < 11; i++) {
                // Get the poll option
                const currentOption = interaction.options.getString(
                    "option" + i
                );
                // If the option was provided by user, add it to option list,
                // save in helperArray that the option exists
                // and set isEmpty to false.
                if (currentOption) {
                    optionList += `${
                        emojis[i]
                    }: ${interaction.options.getString("option" + i)}\n`;
                    helperArray[i] = true;
                    isEmpty = false;
                } else {
                    // If the option was not provided, store this fact in helperArray
                    helperArray[i] = false;
                }
            }
            // If more than 0 options have been provided, add them to embed
            if (!isEmpty) {
                pollEmbed.addFields({ name: "Options", value: optionList });
            }
            // If no options provided, say so in the embed.
            else {
                pollEmbed.addFields({
                    name: "Options",
                    value: `${interaction.member.user.tag} has made a poll with no options to vote on, how curious.`,
                });
            }

            const poll = await interaction.editReply({
                embeds: [pollEmbed],
                fetchReply: true,
            });
            // For each option that was provided, add a reaction
            // with the corresponding emotes.
            for (let i = 0; i < 11; i++) {
                if (helperArray[i]) {
                    poll.react(emojis[i]);
                }
            }
            poll.react("🤷");
        }
    },
};
