const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("goofycommand")
        .setDescription(`sorry, YAGPDB has the hidden advantage, but this command may not be entirely useless anyway...`),
    async execute(interaction) {
        await interaction.reply("if you found a moment when this bot was actually online and ran this command, I'll repeat - YAGPDB has the hidden advantage");
    },
};
