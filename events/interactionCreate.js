const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction){
        // If the interaction isn't a command, do nothing.
        if(!interaction.isChatInputCommand()){
            return;
        }

        // Which command was run?
        const command = interaction.client.commands.get(interaction.commandName);

        // Log an error if the command doesn't exist.
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        // Try to execute the command.
        try{
            await command.execute(interaction);
        }catch (error){
            console.error(`Error executing ${interaction.commandName}`)
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};