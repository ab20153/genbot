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
        await interaction.deferReply();

        // Check if user running the command has the Admin role.
        if (
            !interaction.member.roles.cache.some(
                (role) => role.name === "Admin"
            )
        ) {
            return await interaction.editReply({
                content: "You can't run the command - missing Admin role.",
                ephemeral: true,
            });
        }

        // Get the role to be removed.
        const role = interaction.options.getRole("role");
        // Respond if the bot lacks the permissions to manage the role.
        if (!role.editable) {
            return interaction.editReply({
                content: `Can't remove ${role} - missing permissions.`,
                ephemeral: true,
            });
        }

        // Get the guild this command was run in.
        const server = interaction.guild;
        // Get the members manager of the server.
        const members = server.members;

        // removerole member
        if (interaction.options.getSubcommand() === "member") {
            // Get the member role will be removed from.
            const member = interaction.options.getMember("member");
            await member.roles.remove(role);
            return interaction.editReply(`${role} removed from ${member}.`);
        }

        // removerole all
        if (interaction.options.getSubcommand() === "all") {
            await members.fetch(); //making sure all server members have been cached
            // Add role from each server member.
            await members.cache.forEach((m) => {
                m.roles.remove(role);
            });
            return await interaction.editReply(
                `${role} removed from ${server.memberCount} members.`
            );
        }

        // removerole humans
        if (interaction.options.getSubcommand() === "humans") {
            await members.fetch(); //making sure all server members have been cached
            // Get all server members that aren't bots.
            const humans = members.cache.filter((member) => !member.user.bot);
            // Remove role from each non-bot server member.
            await humans.forEach((h) => {
                h.roles.remove(role);
            });
            return await interaction.editReply(
                `${role} removed from ${humans.size} members.`
            );
        }

        // removerole bots
        if (interaction.options.getSubcommand() === "bots") {
            await members.fetch(); //making sure all server members have been cached
            // Get all server members that are bots.
            const bots = members.cache.filter((member) => member.user.bot);
            // Remove role from all bot members of the server.
            await bots.forEach((b) => {
                b.roles.remove(role);
            });
            return await interaction.editReply(
                `${role} removed from ${bots.size} bots.`
            );
        }

        // removerole in
        if (interaction.options.getSubcommand() === "in") {
            await members.fetch(); //making sure all server members have been cached
            // Get the role a member must have to have a role removed.
            const inRole = interaction.options.getRole("inrole");
            // Get all members that have the inRole and remove the role from each of them.
            await inRole.members.forEach((m) => {
                m.roles.remove(role);
            });
            return await interaction.editReply(
                `${role} removed from ${inRole.members.size} members with role ${inRole}.`
            );
        }

        // removerole xin
        if (interaction.options.getSubcommand() === "xin") {
            await members.fetch(); //making sure all server members have been cached
            // Get the role a member must NOT have to receive the new role.
            const xinRole = interaction.options.getRole("xinrole");
            // Get all members that don't have the xinRole
            const membersNotInRole = members.cache.filter((m) => {
                return !m.roles.cache.find((r) => r.name === xinRole.name);
            });
            // Remove role from all members that don't have xinRole.
            await membersNotInRole.forEach((m) => {
                m.roles.remove(role);
            });
            return await interaction.editReply(
                `${role} removed from ${membersNotInRole.size} members without role ${xinRole}.`
            );
        }
    },
};
