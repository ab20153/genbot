const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get bot\'s latency.'),
    async execute(interaction){
        const msg = await interaction.reply({ content: 'Pinging...', fetchReply: true});
        await interaction.editReply(
            { content: `Pong! Websocket heartbeat: ${interaction.client.ws.ping}ms. Roundtrip latency: ${msg.createdTimestamp - interaction.createdTimestamp}ms.`}
        );
    }
};