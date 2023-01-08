const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clearroles")
        .setDescription(
            "Clear all roles from a member or members. (except roles that the bot can't edit)"
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("member")
                .setDescription("Clear roles from a specific member.")
                .addUserOption((option) =>
                    option
                        .setName("member")
                        .setDescription("The member to clear roles from.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("all")
                .setDescription("Clear roles from all server members.")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("humans")
                .setDescription(
                    "Clear roles from all server members, except bots."
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("bots")
                .setDescription("Clear roles from all server bots.")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("in")
                .setDescription(
                    "Clear roles from all server members that have a specific role."
                )
                .addRoleOption((option) =>
                    option
                        .setName("inrole")
                        .setDescription(
                            "The role a member must have to have their roles cleared."
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("xin")
                .setDescription(
                    "Clear roles from all server members that don't have a specific role."
                )
                .addRoleOption((option) =>
                    option
                        .setName("xinrole")
                        .setDescription(
                            "The role a member must not have to have their roles cleared."
                        )
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

        // Get the guild this command was run in.
        const server = interaction.guild;
        // Get the members manager of the server.
        const members = server.members;

        // clearroles member
        if (interaction.options.getSubcommand() === "member") {
            // Get the member roles will be cleared from.
            const member = interaction.options.getMember("member");
            // Get member's roles.
            let rolesToRemove = member.roles.cache;
            // Ignore the roles bot lacks permissions for
            rolesToRemove.forEach((role) => {
                if (!role.editable) {
                    rolesToRemove.delete(role.id);
                }
            });
            await member.roles.remove(rolesToRemove);
            return interaction.editReply(`Roles cleared from ${member}.`);
        }

        // clearroles all
        if (interaction.options.getSubcommand() === "all") {
            await members.fetch(); //making sure all server members have been cached
            // For each server member...
            await members.cache.forEach((m) => {
                // Get their roles
                let rolesToRemove = m.roles.cache;
                // Ignore any roles bot lacks permissions for
                rolesToRemove.forEach((role) => {
                    if (!role.editable) {
                        rolesToRemove.delete(role.id);
                    }
                });
                // Remove the roles
                m.roles.remove(rolesToRemove);
            });
            return await interaction.editReply(
                `Roles cleared from ${server.memberCount} members.`
            );
        }

        // clearroles humans
        if (interaction.options.getSubcommand() === "humans") {
            await members.fetch(); //making sure all server members have been cached
            // Get all server members that aren't bots.
            const humans = members.cache.filter((member) => !member.user.bot);
            // For each non-bot...
            await humans.forEach((h) => {
                // Get their roles
                let rolesToRemove = h.roles.cache;
                // Ignore any roles bot lacks permissions for
                rolesToRemove.forEach((role) => {
                    if (!role.editable) {
                        rolesToRemove.delete(role.id);
                    }
                });
                // Remove the roles
                h.roles.remove(rolesToRemove);
            });
            return await interaction.editReply(
                `Roles cleared from ${humans.size} members.`
            );
        }

        // clearroles bots
        if (interaction.options.getSubcommand() === "bots") {
            await members.fetch(); //making sure all server members have been cached
            // Get all server members that are bots.
            const bots = members.cache.filter((member) => member.user.bot);
            // For each bot...
            await bots.forEach((b) => {
                // Get their roles
                let rolesToRemove = b.roles.cache;
                // Ignore any roles bot lacks permissions for
                rolesToRemove.forEach((role) => {
                    if (!role.editable) {
                        rolesToRemove.delete(role.id);
                    }
                });
                // Remove the roles
                b.roles.remove(rolesToRemove);
            });
            return await interaction.editReply(
                `Roles cleared from ${bots.size} bots.`
            );
        }

        // clearroles in
        if (interaction.options.getSubcommand() === "in") {
            await members.fetch(); //making sure all server members have been cached
            // Get the role a member must have to be cleared of roles.
            const inRole = interaction.options.getRole("inrole");
            // For each member that has inRole...
            await inRole.members.cache.forEach((m) => {
                // Get their roles
                let rolesToRemove = m.roles.cache;
                // Ignore any roles bot lacks permissions for
                rolesToRemove.forEach((role) => {
                    if (!role.editable) {
                        rolesToRemove.delete(role.id);
                    }
                });
                // Remove the roles
                m.roles.remove(rolesToRemove);
            });
            return await interaction.editReply(
                `Roles cleared from ${inRole.members.cache.size} members with role ${inRole}.`
            );
        }

        // clearroles xin
        if (interaction.options.getSubcommand() === "xin") {
            await members.fetch(); //making sure all server members have been cached
            // Get the role a member must NOT have to be cleared of roles.
            const xinRole = interaction.options.getRole("xinrole");
            // Get all members that don't have the xinRole
            const membersNotInRole = members.cache.filter((m) => {
                return !m.roles.cache.find((r) => r.name === xinRole.name);
            });
            // For each member without xinRole
            await membersNotInRole.forEach((m) => {
                // Get their roles
                let rolesToRemove = m.roles.cache;
                // Ignore any roles bot lacks permissions for
                rolesToRemove.forEach((role) => {
                    if (!role.editable) {
                        rolesToRemove.delete(role.id);
                    }
                });
                // Remove the roles
                m.roles.remove(rolesToRemove);
            });
            return await interaction.editReply(
                `Roles cleared from ${membersNotInRole.size} members without role ${xinRole}.`
            );
        }
    },
};
