const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { randInt } = require("../rand.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getservericon")
        .setDescription("Fetches the icon of the server."),
    async execute(interaction) {
        await interaction.deferReply();
        const server = interaction.guild;

        const serverInfoEmbed = new EmbedBuilder()
            .setColor([randInt(0, 255), randInt(0, 255), randInt(0, 255)])
            .setTitle(`${server.name}'s Icon:`)
            .setImage(server.iconURL())
            .setTimestamp()
            .setFooter({ text: `Server ID: ${server.id}` });

        await interaction.editReply({
            embeds: [serverInfoEmbed],
        });
    },
};
