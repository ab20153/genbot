const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { randInt } = require("../rand.js");
const dayjs = require("dayjs");

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
        await interaction.deferReply();

        // Get the user info should be fetched from.
        const member =
            interaction.options.getMember("member") ?? interaction.member;

        // Build an embed message to display info on the user
        const userInfoEmbed = new EmbedBuilder()
            .setColor([randInt(0, 255), randInt(0, 255), randInt(0, 255)])
            .setTitle(member.user.tag)
            .setThumbnail(member.user.avatarURL())
            .addFields(
                {
                    name: "Display Name",
                    value: member.displayName,
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
        // Fetch all roles from the user.
        member.roles.cache.forEach((element) => {
            rolesList += ` ${element.toString()}`;
        });

        // Add a field to embed to display user's roles.
        userInfoEmbed.addFields({ name: "User's Roles", value: rolesList });

        await interaction.editReply({
            embeds: [userInfoEmbed],
        });
    },
};
