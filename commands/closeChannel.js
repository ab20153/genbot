const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("closechannel")
        .setDescription("Remove permissions to see and speak in a channel to all members with a specific role.")
        .addRoleOption((option) =>
            option
                .setName("role")
                .setDescription("Allow into channel all members with this role. (all roles by defualt)")
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
        const role = interaction.options.getRole("role") ?? undefined;
        const server = interaction.guild;
        const members = server.members;

        await members.fetch(); //making sure all server members have been cached
        if(role){
            await role.members.forEach((m) => {
                channel.permissionOverwrites.edit(m, {
                    "SendMessages": false,
                    "SendMessagesInThreads": false,
                    "CreatePublicThreads": false,
                    "CreatePrivateThreads": false
                });
            });
            return await interaction.editReply({
                content: `${channel} closed for ${role.members.size} members with role ${role}.`,
                ephemeral: true
            });
        }else{
            const itemsWithPerms = channel.permissionOverwrites.cache;
            const membersWithPerms = itemsWithPerms.filter(itemsWithPerms => itemsWithPerms.type == 1);
            await membersWithPerms.forEach((m) => {
                m.edit({
                    "SendMessages": false,
                    "SendMessagesInThreads": false,
                    "CreatePublicThreads": false,
                    "CreatePrivateThreads": false
                });
            });
            return await interaction.editReply({
                content: `${channel} closed for ${membersWithPerms.size} members.`,
                ephemeral: true
            });
        }
    },
};
