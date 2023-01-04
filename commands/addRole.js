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
            member.roles.add(role);
            return interaction.reply(`${role} added to ${member}.`);
        } else if (interaction.options.getSubcommand() === "all") {
            await interaction.deferReply();
            await members.fetch(); //making sure all server members have been cached
            members.cache.forEach((m) => {
                m.roles.add(role);
            });
            return await interaction.editReply(
                `${role} added to ${server.memberCount} members.`
            );
        } else if (interaction.options.getSubcommand() === "humans") {
            await interaction.deferReply();
            await members.fetch(); //making sure all server members have been cached
            const humans = members.cache.filter((member) => !member.user.bot);
            humans.forEach((h) => {
                h.roles.add(role);
            });
            return await interaction.editReply(
                `${role} added to ${humans.size} members.`
            );
        } else if (interaction.options.getSubcommand() === "bots") {
            await interaction.deferReply();
            await members.fetch(); //making sure all server members have been cached
            const bots = members.cache.filter((member) => member.user.bot);
            bots.forEach((b) => {
                b.roles.add(role);
            });
            return await interaction.editReply(
                `${role} added to ${bots.size} bots.`
            );
        } else if (interaction.options.getSubcommand() === "in") {
            await interaction.deferReply();
            await members.fetch(); //making sure all server members have been cached
            const inRole = interaction.options.getRole("inrole");
            const membersInRole = members.cache.filter((m) => {
                return m.roles.cache.find((r) => r.name === inRole.name);
            });
            membersInRole.forEach((m) => {
                m.roles.add(role);
            });
            return await interaction.editReply(
                `${role} added to ${membersInRole.size} members with role ${inRole}.`
            );
        } else if (interaction.options.getSubcommand() === "xin") {
            await interaction.deferReply();
            await members.fetch(); //making sure all server members have been cached
            const xinRole = interaction.options.getRole("xinrole");
            const membersNotInRole = members.cache.filter((m) => {
                return !(m.roles.cache.find((r) => r.name === xinRole.name));
            });
            membersNotInRole.forEach((m) => {
                m.roles.add(role);
            });
            return await interaction.editReply(
                `${role} added to ${membersNotInRole.size} members without role ${xinRole}.`
            );
        }

        await interaction.reply("Something went wrong.");
    },
};
