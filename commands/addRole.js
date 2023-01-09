const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addrole")
        .setDescription("Add a role.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("member")
                .setDescription("Add a role to a specific member.")
                .addUserOption((option) =>
                    option
                        .setName("member")
                        .setDescription("The member to add a role to.")
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

        // Get the role to be added.
        const role = interaction.options.getRole("role");

        // Respond if the bot lacks the permissions to manage the role.
        if (!role.editable) {
            return interaction.editReply({
                content: `Can't add ${role} - missing permissions.`,
                ephemeral: true,
            });
        }

        // Get the guild this command was run in.
        const server = interaction.guild;
        // Get the members manager of the server.
        const members = server.members;

        // addRole member
        if (interaction.options.getSubcommand() === "member") {
            // Get the member role will be added to.
            const member = interaction.options.getMember("member");
            await member.roles.add(role);
            return interaction.editReply(`${role} added to ${member}.`);
        }

        // addRole all
        if (interaction.options.getSubcommand() === "all") {
            await members.fetch(); //making sure all server members have been cached
            // Add role to each server member.
            await members.cache.forEach((m) => {
                m.roles.add(role);
            });
            return await interaction.editReply(
                `${role} added to ${server.memberCount} members.`
            );
        }

        // addRole humans
        if (interaction.options.getSubcommand() === "humans") {
            await members.fetch(); //making sure all server members have been cached
            // Get all server members that aren't bots.
            const humans = members.cache.filter((member) => !member.user.bot);
            // Add role to each non-bot server member.
            await humans.forEach((h) => {
                h.roles.add(role);
            });
            return await interaction.editReply(
                `${role} added to ${humans.size} members.`
            );
        }

        // addrole bots
        if (interaction.options.getSubcommand() === "bots") {
            await members.fetch(); //making sure all server members have been cached
            // Get all server members that are bots.
            const bots = members.cache.filter((member) => member.user.bot);
            // Add role to all bot members of the server.
            await bots.forEach((b) => {
                b.roles.add(role);
            });
            return await interaction.editReply(
                `${role} added to ${bots.size} bots.`
            );
        }

        // addrole in
        if (interaction.options.getSubcommand() === "in") {
            await members.fetch(); //making sure all server members have been cached
            // Get the role a member must have to receive the new role.
            const inRole = interaction.options.getRole("inrole");
            // Get all members that have the inRole and add the role to each of them.
            await inRole.members.forEach((m) => {
                m.roles.add(role);
            });
            return await interaction.editReply(
                `${role} added to ${inRole.members.size} members with role ${inRole}.`
            );
        }

        // add role xin
        if (interaction.options.getSubcommand() === "xin") {
            await members.fetch(); //making sure all server members have been cached
            // Get the role a member must NOT have to receive the new role.
            const xinRole = interaction.options.getRole("xinrole");
            // Get all members that don't have the xinRole
            const membersNotInRole = members.cache.filter((m) => {
                return !m.roles.cache.find((r) => r.name === xinRole.name);
            });
            // Add role to all members that don't have xinRole.
            await membersNotInRole.forEach((m) => {
                m.roles.add(role);
            });
            return await interaction.editReply(
                `${role} added to ${membersNotInRole.size} members without role ${xinRole}.`
            );
        }
    },
};
