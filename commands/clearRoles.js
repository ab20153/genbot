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
        
        const server = interaction.guild;
        const members = server.members;

        if (interaction.options.getSubcommand() === "member") {
            const member = interaction.options.getMember("member");
            let rolesToRemove = member.roles.cache;
            rolesToRemove.forEach((role) => {
                if (!role.editable) {
                    rolesToRemove.delete(role.id);
                }
            });
            await member.roles.remove(rolesToRemove);
            return interaction.editReply(`Roles cleared from ${member}.`);
        }
        if (interaction.options.getSubcommand() === "all") {
            await members.fetch(); //making sure all server members have been cached
            await members.cache.forEach((m) => {
                let rolesToRemove = m.roles.cache;
                rolesToRemove.forEach((role) => {
                    if (!role.editable) {
                        rolesToRemove.delete(role.id);
                    }
                });
                m.roles.remove(rolesToRemove);
            });
            return await interaction.editReply(
                `Roles cleared from ${server.memberCount} members.`
            );
        }
        if (interaction.options.getSubcommand() === "humans") {
            await members.fetch(); //making sure all server members have been cached
            const humans = members.cache.filter((member) => !member.user.bot);
            await humans.forEach((h) => {
                let rolesToRemove = h.roles.cache;
                rolesToRemove.forEach((role) => {
                    if (!role.editable) {
                        rolesToRemove.delete(role.id);
                    }
                });
                h.roles.remove(rolesToRemove);
            });
            return await interaction.editReply(
                `Roles cleared from ${humans.size} members.`
            );
        }
        if (interaction.options.getSubcommand() === "bots") {
            await members.fetch(); //making sure all server members have been cached
            const bots = members.cache.filter((member) => member.user.bot);
            await bots.forEach((b) => {
                let rolesToRemove = b.roles.cache;
                rolesToRemove.forEach((role) => {
                    if (!role.editable) {
                        rolesToRemove.delete(role.id);
                    }
                });
                b.roles.remove(rolesToRemove);
            });
            return await interaction.editReply(
                `Roles cleared from ${bots.size} bots.`
            );
        }
        if (interaction.options.getSubcommand() === "in") {
            await members.fetch(); //making sure all server members have been cached
            const inRole = interaction.options.getRole("inrole");
            await inRole.members.cache.forEach((m) => {
                let rolesToRemove = m.roles.cache;
                rolesToRemove.forEach((role) => {
                    if (!role.editable) {
                        rolesToRemove.delete(role.id);
                    }
                });
                m.roles.remove(rolesToRemove);
            });
            return await interaction.editReply(
                `Roles cleared from ${inRole.members.cache.size} members with role ${inRole}.`
            );
        }
        if (interaction.options.getSubcommand() === "xin") {
            await members.fetch(); //making sure all server members have been cached
            const xinRole = interaction.options.getRole("xinrole");
            const membersNotInRole = members.cache.filter((m) => {
                return !m.roles.cache.find((r) => r.name === xinRole.name);
            });
            await membersNotInRole.forEach((m) => {
                let rolesToRemove = m.roles.cache;
                rolesToRemove.forEach((role) => {
                    if (!role.editable) {
                        rolesToRemove.delete(role.id);
                    }
                });
                m.roles.remove(rolesToRemove);
            });
            return await interaction.editReply(
                `Roles cleared from ${membersNotInRole.size} members without role ${xinRole}.`
            );
        }
    },
};
