const { SlashCommandBuilder, EmbedBuilder, inlineCode } = require("discord.js");
const Rand = require("../rand.js");
const dayjs = require("dayjs");
//import dayjs from 'dayjs' // ES 2015

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roleinfo")
        .setDescription("Provides information about the role.")
        .addRoleOption((option) =>
            option
                .setName("role")
                .setDescription("The role to check.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const role =
            interaction.options.getRole("role");

        const roleInfoEmbed = new EmbedBuilder()
            .setColor(role.hexColor)
            .setTitle(role.name)
            .addFields(
                {
                    name: "Created At",
                    value: dayjs(role.createdAt).format(
                        "ddd, MMM D, YYYY, HH:mm:ss"
                    )
                },
                { 
                    inline: true,
                    name: "Role Mention",
                    value: inlineCode(role.toString())
                },
                
                {
                    inline: true,
                    name: "Color Hex Code",
                    value: role.hexColor
                },
                {
                    inline: true,
                    name: "Managable By This Bot",
                    value: role.editable.toString()
                },
                {
                    inline: true,
                    name: "Hoisted",
                    value: role.hoist.toString()
                },
                {
                    inline: true,
                    name: "Mentionable",
                    value: role.mentionable.toString()
                },
                {
                    inline: true,
                    name: "Position",
                    value: role.position.toString()
                }
            )
            .setTimestamp()
            .setFooter({ text: `Role ID: ${role.id}` });

        await interaction.reply({
            embeds: [roleInfoEmbed],
        });
    },
};
