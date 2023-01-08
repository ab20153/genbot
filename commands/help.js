const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    SlashCommandBuilder,
    EmbedBuilder,
    Events,
} = require("discord.js");
const Rand = require("../rand.js");
const fs = require("node:fs"); //node's file system module

let embeds = [];
const itemsPerPage = 8;

const getRow = (index) => {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("prev")
                .setEmoji("◀️")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(!index)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("next")
                .setEmoji("▶️")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(
                    Math.floor(index / itemsPerPage) === embeds.length - 1
                )
        );
    return row;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Information about the bot's commands."),
    async execute(interaction) {
        await interaction.deferReply();
        const commandFiles = fs
            .readdirSync("./commands")
            .filter((file) => file.endsWith(".js"));
        const commandCount = commandFiles.length;
        const pageCount = Math.ceil(commandCount / itemsPerPage);

        for (let i = 0; i < pageCount; i++) {
            const page = new EmbedBuilder()
                .setColor([
                    Rand.randInt(0, 255),
                    Rand.randInt(0, 255),
                    Rand.randInt(0, 255),
                ])
                .setTitle(`Commands (${i + 1}/${pageCount})`);

            embeds[i] = page;
        }

        for (let i = 0; i < commandCount; i++) {
            const command = require(`./${commandFiles[i]}`);
            const currentPage = Math.floor(i / itemsPerPage);
            embeds[currentPage].addFields({
                name: command.data.name,
                value: command.data.description,
            });
        }

        let currentIndex = 0;
        const row = getRow(currentIndex);

        await interaction.editReply({
            embeds: [embeds[Math.floor(currentIndex / 8)]],
            components: [row],
            ephemeral: true,
        });

        interaction.client.on(Events.InteractionCreate, (interactionButton) => {
            if (!interactionButton.isButton()) return;

            if (interactionButton.customId.startsWith("prev")) {
                currentIndex -= 8;
                const row = getRow(currentIndex);
                interactionButton.update({
                    embeds: [embeds[Math.floor(currentIndex / 8)]],
                    components: [row],
                    ephemeral: true,
                });
            } else if (interactionButton.customId.startsWith("next")) {
                currentIndex += 8;
                const row = getRow(currentIndex);
                interactionButton.update({
                    embeds: [embeds[Math.floor(currentIndex / 8)]],
                    components: [row],
                    ephemeral: true,
                });
            }
        });
    },
};
