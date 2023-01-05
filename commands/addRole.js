const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addrole")
        .setDescription("Add a role to a member or members.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("member")
                .setDescription("Add a role to a specific member.")
                .addUserOption((option) =>
                    option
                        .setName("member")
                        .setDescription("The member to add role to.")
                        .setRequired(true)
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to add.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("all")
                .setDescription("Add a role to all server members.")
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to add.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("humans")
                .setDescription(
                    "Add a role to all server members, except bots."
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to add.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("bots")
                .setDescription("Add a role to all server bots.")
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to add.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("in")
                .setDescription(
                    "Add a role to all server members that have a specific role."
                )
                .addRoleOption((option) =>
                    option
                        .setName("inrole")
                        .setDescription(
                            "The role a member must have to receive the added role."
                        )
                        .setRequired(true)
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to add.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("xin")
                .setDescription(
                    "Add a role to all server members that don't have a specific role."
                )
                .addRoleOption((option) =>
                    option
                        .setName("xinrole")
                        .setDescription(
                            "The role a member must not have to receive the added role."
                        )
                        .setRequired(true)
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to add.")
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const role = interaction.options.getRole("role");
        if (!role.editable) {
            return interaction.reply({
                content: `Can't add ${role} - missing permissions.`,
                ephemeral: true,
            });
        }

        const server = interaction.guild;
        const members = server.members;

        if (interaction.options.getSubcommand() === "member") {
            const member = interaction.options.getMember("member");
            await member.roles.add(role);
            return interaction.editReply(`${role} added to ${member}.`);
        }
        if (interaction.options.getSubcommand() === "all") {
            await members.fetch(); //making sure all server members have been cached
            await members.cache.forEach((m) => {
                m.roles.add(role);
            });
            return await interaction.editReply(
                `${role} added to ${server.memberCount} members.`
            );
        }
        if (interaction.options.getSubcommand() === "humans") {
            await members.fetch(); //making sure all server members have been cached
            const humans = members.cache.filter((member) => !member.user.bot);
            await humans.forEach((h) => {
                h.roles.add(role);
            });
            return await interaction.editReply(
                `${role} added to ${humans.size} members.`
            );
        }
        if (interaction.options.getSubcommand() === "bots") {
            await members.fetch(); //making sure all server members have been cached
            const bots = members.cache.filter((member) => member.user.bot);
            await bots.forEach((b) => {
                b.roles.add(role);
            });
            return await interaction.editReply(
                `${role} added to ${bots.size} bots.`
            );
        }
        if (interaction.options.getSubcommand() === "in") {
            await members.fetch(); //making sure all server members have been cached
            const inRole = interaction.options.getRole("inrole");
            await inRole.members.cache.forEach((m) => {
                m.roles.add(role);
            });
            return await interaction.editReply(
                `${role} added to ${inRole.members.cache.size} members with role ${inRole}.`
            );
        }
        if (interaction.options.getSubcommand() === "xin") {
            await members.fetch(); //making sure all server members have been cached
            const xinRole = interaction.options.getRole("xinrole");
            const membersNotInRole = members.cache.filter((m) => {
                return !m.roles.cache.find((r) => r.name === xinRole.name);
            });
            await membersNotInRole.forEach((m) => {
                m.roles.add(role);
            });
            return await interaction.editReply(
                `${role} added to ${membersNotInRole.size} members without role ${xinRole}.`
            );
        }
    },
};
