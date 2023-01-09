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

        // Get the role to be toggled.
        const role = interaction.options.getRole("role");

        // Respond if the bot lacks the permissions to manage the role.
        if (!role.editable) {
            return interaction.editReply({
                content: `Can't toggle ${role} - missing permissions.`,
                ephemeral: true,
            });
        }

        // Get the guild this command was run in.
        const server = interaction.guild;
        // Get the members manager of the server.
        const members = server.members;

        // togglerole member
        if (interaction.options.getSubcommand() === "member") {
            // Get the member role will be toggled for.
            const member = interaction.options.getMember("member");
            // Toggle the role.
            if (member.roles.cache.find((r) => r.name === role.name)) {
                await member.roles.remove(role);
            } else {
                await member.roles.add(role);
            }
            return interaction.editReply(`${role} toggled for ${member}.`);
        }

        // togglerole all
        if (interaction.options.getSubcommand() === "all") {
            await members.fetch(); //making sure all server members have been cached
            // Toggle the role for each server member.
            await members.cache.forEach((m) => {
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

        // togglerole humans
        if (interaction.options.getSubcommand() === "humans") {
            await members.fetch(); //making sure all server members have been cached
            // Get all server members that aren't bots.
            const humans = members.cache.filter((member) => !member.user.bot);
            // Toggle role for each non-bot server member.
            await humans.forEach((h) => {
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

        // togglerole bots
        if (interaction.options.getSubcommand() === "bots") {
            await members.fetch(); //making sure all server members have been cached
            // Get all server members that are bots.
            const bots = members.cache.filter((member) => member.user.bot);
            // Toggle role for all bot members of the server.
            await bots.forEach((b) => {
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

        // togglerole in
        if (interaction.options.getSubcommand() === "in") {
            await members.fetch(); //making sure all server members have been cached
            // Get the role a member must have have the role toggled.
            const inRole = interaction.options.getRole("inrole");
            // Get all members that have the inRole and toggle the role for each of them.
            await inRole.members.forEach((m) => {
                if (m.roles.cache.find((r) => r.name === role.name)) {
                    m.roles.remove(role);
                } else {
                    m.roles.add(role);
                }
            });
            return await interaction.editReply(
                `${role} toggled for ${inRole.members.size} members with role ${inRole}.`
            );
        }

        // togglerole xin
        if (interaction.options.getSubcommand() === "xin") {
            await members.fetch(); //making sure all server members have been cached
            // Get the role a member must NOT have to receive the new role.
            const xinRole = interaction.options.getRole("xinrole");
            // Get all members that don't have the xinRole
            const membersNotInRole = members.cache.filter((m) => {
                return !m.roles.cache.find((r) => r.name === xinRole.name);
            });
            // Toggle role for all members that don't have xinRole.
            await membersNotInRole.forEach((m) => {
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
    },
};
