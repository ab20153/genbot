const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("togglerole")
        .setDescription(
            "Add a role to a member or members if they don't have it or remove it if they do."
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("member")
                .setDescription("Toggle a role for a specific member.")
                .addUserOption((option) =>
                    option
                        .setName("member")
                        .setDescription("The member to toggle role for.")
                        .setRequired(true)
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to toggle.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("all")
                .setDescription("Toggle a role for all server members.")
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to toggle.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("humans")
                .setDescription(
                    "Toggle a role for all server members, except bots."
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to toggle.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("bots")
                .setDescription("Toggle a role for all server bots.")
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to toggle.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("in")
                .setDescription(
                    "Toggle a role for all server members that have a specific role."
                )
                .addRoleOption((option) =>
                    option
                        .setName("inrole")
                        .setDescription(
                            "The role a member must have for given role to be toggled."
                        )
                        .setRequired(true)
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to toggle.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("xin")
                .setDescription(
                    "Toggle a role for all server members that don't have a specific role."
                )
                .addRoleOption((option) =>
                    option
                        .setName("xinrole")
                        .setDescription(
                            "The role a member must not have for given role to be toggled."
                        )
                        .setRequired(true)
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to toggle.")
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const role = interaction.options.getRole("role");
        if (!role.editable) {
            return interaction.reply({
                content: `Can't toggle ${role} - missing permissions.`,
                ephemeral: true,
            });
        }

        const server = interaction.guild;
        const members = server.members;

        if (interaction.options.getSubcommand() === "member") {
            const member = interaction.options.getMember("member");
            if (member.roles.cache.find((r) => r.name === role.name)) {
                member.roles.remove(role);
            } else {
                member.roles.add(role);
            }
            return interaction.editReply(`${role} toggled for ${member}.`);
        }
        if (interaction.options.getSubcommand() === "all") {
            await members.fetch(); //making sure all server members have been cached
            members.cache.forEach((m) => {
                if (m.roles.cache.find((r) => r.name === role.name)) {
                    m.roles.remove(role);
                } else {
                    m.roles.add(role);
                }
            });
            return await interaction.editReply(
                `${role} toggled for ${server.memberCount} members.`
            );
        }
        if (interaction.options.getSubcommand() === "humans") {
            await members.fetch(); //making sure all server members have been cached
            const humans = members.cache.filter((member) => !member.user.bot);
            humans.forEach((h) => {
                if (h.roles.cache.find((r) => r.name === role.name)) {
                    h.roles.remove(role);
                } else {
                    h.roles.add(role);
                }
            });
            return await interaction.editReply(
                `${role} toggled for ${humans.size} members.`
            );
        }
        if (interaction.options.getSubcommand() === "bots") {
            await members.fetch(); //making sure all server members have been cached
            const bots = members.cache.filter((member) => member.user.bot);
            bots.forEach((b) => {
                if (b.roles.cache.find((r) => r.name === role.name)) {
                    b.roles.remove(role);
                } else {
                    b.roles.add(role);
                }
            });
            return await interaction.editReply(
                `${role} toggled for ${bots.size} bots.`
            );
        }
        if (interaction.options.getSubcommand() === "in") {
            await members.fetch(); //making sure all server members have been cached
            const inRole = interaction.options.getRole("inrole");
            inRole.members.cache.forEach((m) => {
                if (m.roles.cache.find((r) => r.name === role.name)) {
                    m.roles.remove(role);
                } else {
                    m.roles.add(role);
                }
            });
            return await interaction.editReply(
                `${role} toggled for ${inRole.members.cache.size} members with role ${inRole}.`
            );
        }
        if (interaction.options.getSubcommand() === "xin") {
            await members.fetch(); //making sure all server members have been cached
            const xinRole = interaction.options.getRole("xinrole");
            const membersNotInRole = members.cache.filter((m) => {
                return !m.roles.cache.find((r) => r.name === xinRole.name);
            });
            membersNotInRole.forEach((m) => {
                if (m.roles.cache.find((r) => r.name === role.name)) {
                    m.roles.remove(role);
                } else {
                    m.roles.add(role);
                }
            });
            return await interaction.editReply(
                `${role} toggled for ${membersNotInRole.size} members without role ${xinRole}.`
            );
        }

        await interaction.reply("Something went wrong.");
    },
};
