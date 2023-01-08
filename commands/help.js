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

// Array that will store the pages with commands.
let embeds = [];
// We'll split the commands in batches of 8, one batch per page
const itemsPerPage = 8;

// Helper command to generate buttons for page navigation
const getRow = (index) => {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("prev")
                .setEmoji("◀️")
                .setStyle(ButtonStyle.Secondary)
                // If we're looking at the start of
                // the command list, no need for a
                // previous page button
                .setDisabled(!index)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("next")
                .setEmoji("▶️")
                .setStyle(ButtonStyle.Secondary)
                // If we're looking at the end of
                // the command list, no need for a
                // next page button
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

        // Get all command files.
        const commandFiles = fs
            .readdirSync("./commands")
            .filter((file) => file.endsWith(".js"));

        // Count the commands.
        const commandCount = commandFiles.length;

        // Calculate how many pages will be needed to display all commands.
        const pageCount = Math.ceil(commandCount / itemsPerPage);

        // Generate as many blank embeds as pageCount
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

        // Populate the blank embeds with command information
        for (let i = 0; i < commandCount; i++) {
            const command = require(`./${commandFiles[i]}`);
            // Which page the command should go in
            const currentPage = Math.floor(i / itemsPerPage);
            embeds[currentPage].addFields({
                name: command.data.name,
                value: command.data.description,
            });
        }

        // Which command we're currently looking at
        let currentIndex = 0;
        // Get nav buttons based on currentIndex
        const row = getRow(currentIndex);

        await interaction.editReply({
            embeds: [embeds[Math.floor(currentIndex / itemsPerPage)]],
            components: [row],
            ephemeral: true,
        });

        // Event listener that looks for button pushes.
        interaction.client.on(Events.InteractionCreate, (interactionButton) => {
            if (!interactionButton.isButton()) return;

            // If previous page button clicked
            if (interactionButton.customId.startsWith("prev")) {
                // Move back in item list.
                currentIndex -= itemsPerPage;
                // Regenerate nav buttons
                const row = getRow(currentIndex);
                // Display the embed corresponding to previous page
                interactionButton.update({
                    embeds: [embeds[Math.floor(currentIndex / itemsPerPage)]],
                    components: [row],
                    ephemeral: true,
                });
            } else if (interactionButton.customId.startsWith("next")) {
                // Move forward in item list.
                currentIndex += itemsPerPage;
                // Regenerate nav buttons
                const row = getRow(currentIndex);
                // Display the embed corresponding to next page
                interactionButton.update({
                    embeds: [embeds[Math.floor(currentIndex / itemsPerPage)]],
                    components: [row],
                    ephemeral: true,
                });
            }
        });
    },
};
