const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Rand = require("../rand.js");

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
                .setDescription("Poll asking a yes or no question, but the poll will not use embeds and take up less space.")
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
                    option
                        .setName("option1")
                        .setDescription("The question.")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("option2")
                        .setDescription("The question.")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("option3")
                        .setDescription("The question.")
                )
                .addStringOption((option) =>
                    option
                        .setName("option4")
                        .setDescription("The question.")
                )
                .addStringOption((option) =>
                    option
                        .setName("option5")
                        .setDescription("The question.")
                )
                .addStringOption((option) =>
                    option
                        .setName("option6")
                        .setDescription("The question.")
                )
                .addStringOption((option) =>
                    option
                        .setName("option7")
                        .setDescription("The question.")
                )
                .addStringOption((option) =>
                    option
                        .setName("option8")
                        .setDescription("The question.")
                )
                .addStringOption((option) =>
                    option
                        .setName("option9")
                        .setDescription("The question.")
                )
                .addStringOption((option) =>
                    option
                        .setName("option10")
                        .setDescription("The question.")
                )
                .addStringOption((option) =>
                    option
                        .setName("option0")
                        .setDescription("The question.")
                )
        ),
    async execute(interaction) {
        const question = interaction.options.getString("question");

        if (interaction.options.getSubcommand() === "compact") {
            const poll = await interaction.reply({ content: question, fetchReply: true });
		    poll.react('👍');
            poll.react('👎');
            poll.react('🤷');
            return;
        }

        const pollEmbed = new EmbedBuilder()
        .setColor([
            Rand.randInt(0, 255),
            Rand.randInt(0, 255),
            Rand.randInt(0, 255),
        ])
        .setTitle(question)
        .setAuthor({ name: `${interaction.member.user.tag} asks:`, iconURL: interaction.member.avatarURL() })
        .setTimestamp();

        if (interaction.options.getSubcommand() === "yesno") {
            const poll = await interaction.reply({ embeds: [pollEmbed], fetchReply: true, });
		    poll.react('👍');
            poll.react('👎');
            poll.react('🤷');
        }
        else if (interaction.options.getSubcommand() === "multichoice") {
            let optionList = "";
            const emojis = ['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
            let helperArray = [];
            for(let i=0; i<11; i++){
                const currentOption = interaction.options.getString("option"+i);
                if(currentOption){
                    optionList += `${emojis[i]}: ${interaction.options.getString("option"+i)}\n`;
                    helperArray[i] = true;
                }
                else{
                    helperArray[i] = false;
                }
            }
            pollEmbed.addFields({ name: "Options", value: optionList })
            const poll = await interaction.reply({ embeds: [pollEmbed], fetchReply: true, });
            for(let i=0; i<11; i++){
                if(helperArray[i]){
                    poll.react(emojis[i]);
                }
            }
            poll.react('🤷');
        }
    },
};
