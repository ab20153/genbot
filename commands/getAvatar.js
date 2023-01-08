const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { randInt } = require("../rand.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getavatar")
        .setDescription("Fetches the avatar of a server member.")
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("The server member to get avatar from.")
        ),
    async execute(interaction) {
        await interaction.deferReply();

        // Get the user to get avatar from
        const member =
            interaction.options.getMember("member") ?? interaction.member;

        // Build an embed message with the user's avatar
        const userInfoEmbed = new EmbedBuilder()
            .setColor([randInt(0, 255), randInt(0, 255), randInt(0, 255)])
            .setTitle(`${member.user.tag}'s Avatar:`)
            .setImage(member.user.avatarURL())
            .setTimestamp()
            .setFooter({ text: `User ID: ${member.id}` });

        await interaction.editReply({
            embeds: [userInfoEmbed],
        });
    },
};
