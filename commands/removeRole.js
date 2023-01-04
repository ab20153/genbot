const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removerole")
        .setDescription("Remove a role from a member or members.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("member")
                .setDescription("Remove a role from a specific member.")
                .addUserOption((option) =>
                    option
                        .setName("member")
                        .setDescription("The member to remove role from.")
                        .setRequired(true)
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to remove.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("all")
                .setDescription("Remove a role from all server members.")
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to remove.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("humans")
                .setDescription(
                    "Remove a role from all server members, except bots."
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to remove.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("bots")
                .setDescription("Remove a role from all server bots.")
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to remove.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("in")
                .setDescription(
                    "Remove a role from all server members that have a specific role."
                )
                .addRoleOption((option) =>
                    option
                        .setName("inrole")
                        .setDescription(
                            "The role a member must have to lose the removed role."
                        )
                        .setRequired(true)
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to remove.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("xin")
                .setDescription(
                    "Remove a role from all server members that don't have a specific role."
                )
                .addRoleOption((option) =>
                    option
                        .setName("xinrole")
                        .setDescription(
                            "The role a member must not have to lose the removed role."
                        )
                        .setRequired(true)
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to remove.")
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        const role = interaction.options.getRole("role");
        if (!role.editable) {
            return interaction.reply({
                content: `Can't remove ${role} - missing permissions.`,
                ephemeral: true,
            });
        }

        const server = interaction.guild;
        const members = server.members;

        if (interaction.options.getSubcommand() === "member") {
            const member = interaction.options.getMember("member");
            member.roles.remove(role);
            return interaction.reply(`${role} removed from ${member}.`);
        } else if (interaction.options.getSubcommand() === "all") {
            await interaction.deferReply();
            await members.fetch(); //making sure all server members have been cached
            members.cache.forEach((m) => {
                m.roles.remove(role);
            });
            return await interaction.editReply(
                `${role} removed from ${server.memberCount} members.`
            );
        } else if (interaction.options.getSubcommand() === "humans") {
            await interaction.deferReply();
            await members.fetch(); //making sure all server members have been cached
            const humans = members.cache.filter((member) => !member.user.bot);
            humans.forEach((h) => {
                h.roles.remove(role);
            });
            return await interaction.editReply(
                `${role} removed from ${humans.size} members.`
            );
        } else if (interaction.options.getSubcommand() === "bots") {
            await interaction.deferReply();
            await members.fetch(); //making sure all server members have been cached
            const bots = members.cache.filter((member) => member.user.bot);
            bots.forEach((b) => {
                b.roles.remove(role);
            });
            return await interaction.editReply(
                `${role} remove from ${bots.size} bots.`
            );
        } else if (interaction.options.getSubcommand() === "in") {
            await interaction.deferReply();
            await members.fetch(); //making sure all server members have been cached
            const inRole = interaction.options.getRole("inrole");
            const membersInRole = members.cache.filter((m) => {
                return m.roles.cache.find((r) => r.name === inRole.name);
            });
            membersInRole.forEach((m) => {
                m.roles.remove(role);
            });
            return await interaction.editReply(
                `${role} remove from ${membersInRole.size} members with role ${inRole}.`
            );
        } else if (interaction.options.getSubcommand() === "xin") {
            await interaction.deferReply();
            await members.fetch(); //making sure all server members have been cached
            const xinRole = interaction.options.getRole("xinrole");
            const membersNotInRole = members.cache.filter((m) => {
                return !(m.roles.cache.find((r) => r.name === xinRole.name));
            });
            membersNotInRole.forEach((m) => {
                m.roles.remove(role);
            });
            return await interaction.editReply(
                `${role} remove from ${membersNotInRole.size} members without role ${xinRole}.`
            );
        }

        await interaction.reply("Something went wrong.");
    },
};
