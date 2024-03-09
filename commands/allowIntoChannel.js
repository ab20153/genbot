const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("allowintochannel")
        .setDescription("Give permission to see and speak in a channel to all members with a specific role.")
        .addRoleOption((option) =>
            option
                .setName("role")
                .setDescription("Allow into channel all members with this role.")
                .setRequired(true)
        )
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("Channel to allow members into (current channel by default).")
        ),
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});

        // Check if user running the command has role management permissions.
        if (
            !interaction.member.permissions.has('ManageRoles', true)
        ) {
            return await interaction.editReply({
                content: "You can't run the command - missing Manage Roles permission.",
                ephemeral: true,
            });
        }

        const channel = interaction.options.getChannel("channel") ?? interaction.channel;
        const role = interaction.options.getRole("role");
        const server = interaction.guild;
        const members = server.members;

        await members.fetch(); //making sure all server members have been cached
        await role.members.forEach((m) => {
            channel.permissionOverwrites.edit(m, {
                "ViewChannel": true,
                "SendMessages": true,
                "SendMessagesInThreads": true,
                "CreatePublicThreads": true,
                "CreatePrivateThreads": true
            });
        });

        return await interaction.editReply(
            `${role.members.size} members with role ${role} allowed into ${channel}.`
        );
    },
};
