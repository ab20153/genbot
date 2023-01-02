const { SlashCommandBuilder, EmbedBuilder, inlineCode } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addrole")
        .setDescription("Adds a role to a member.")
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("The member to add role to. (leave blank to add to all members)")
        )
        .addRoleOption((option) =>
            option
                .setName("role")
                .setDescription("The role to check. (leave blank to add all roles")
        ),
    async execute(interaction) {
        const member = interaction.options.getUser("member");
        const role = interaction.options.getRole("role");

        await interaction.reply('placeholder');
    },
};
