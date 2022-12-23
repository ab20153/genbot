const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Rand = require("../rand.js");
const dayjs = require("dayjs");
//import dayjs from 'dayjs' // ES 2015

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Provides information about the user.")
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("The server member to check.")
        ),
    async execute(interaction) {
        const member =
            interaction.options.getMember("member") ?? interaction.member;

        const userInfoEmbed = new EmbedBuilder()
            .setColor([
                Rand.randInt(0, 255),
                Rand.randInt(0, 255),
                Rand.randInt(0, 255),
            ])
            .setTitle(member.user.tag)
            .setThumbnail(member.user.avatarURL())
            .addFields(
                { 
                    name: "Display Name",
                    value: member.displayName
                },
                {
                    inline: true,
                    name: "Account Registered",
                    value: dayjs(member.user.createdAt).format(
                        "ddd, MMM D, YYYY, HH:mm:ss"
                    ),
                },
                {
                    inline: true,
                    name: "Member Since",
                    value: dayjs(member.joinedAt).format(
                        "ddd, MMM D, YYYY, HH:mm:ss"
                    ),
                }
            )
            .setTimestamp()
            .setFooter({ text: `User ID: ${member.id}` });

        let rolesList = "";
        member.roles.cache.forEach(element => {
            rolesList += ` ${element.toString()}`;
        });

        userInfoEmbed.addFields({ name: "User's Roles", value: rolesList });

        await interaction.reply({
            embeds: [userInfoEmbed],
        });
    },
};
