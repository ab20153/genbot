const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { randInt } = require("../rand.js");
const dayjs = require("dayjs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("Provides information about the server."),
    async execute(interaction) {
        await interaction.deferReply();

        // Get the guild this command was run in.
        const server = interaction.guild;
        // Get the roles that exist in the guild.
        const roles = server.roles;
        // Get the channels that exist in the guild.
        const channels = server.channels;
        await interaction.guild.members.fetch(); //making sure all server members have been cached
        // Get the members that exist in the guild.
        const members = server.members;
        // Get the number of bots and non-bots in the guild.
        const bots = members.cache.filter((member) => member.user.bot).size;
        const humans = members.cache.filter((member) => !member.user.bot).size;

        const serverInfoEmbed = new EmbedBuilder()
            .setColor([randInt(0, 255), randInt(0, 255), randInt(0, 255)])
            .setTitle(server.name)
            .setThumbnail(server.iconURL())
            .addFields(
                {
                    name: "Description",
                    value: server.description ?? "*no description*",
                },
                {
                    name: "Server Owner",
                    value: `<@${server.ownerId}>`,
                },
                {
                    name: "Server Created",
                    value: dayjs(server.createdAt).format(
                        "ddd, MMM D, YYYY, HH:mm:ss"
                    ),
                },
                {
                    inline: true,
                    name: "Member Count",
                    value: `${humans} human(s).
						${bots} bot(s).
						Total users: ${server.memberCount.toString()}`,
                },
                {
                    inline: true,
                    name: "Roles",
                    value: `${roles.cache.size.toString()} role(s).
						${roles.highest.toString()} is the highest role.`,
                },
                {
                    inline: true,
                    name: "Channel Count",
                    value: `${
                        channels.cache.filter((channel) => channel.type === 4)
                            .size
                    } categorie(s).
						${
                            channels.cache.filter(
                                (channel) => channel.type === 5
                            ).size
                        } announcement channel(s).
						${channels.cache.filter((channel) => channel.type === 2).size} voice channel(s).
						${
                            channels.cache.filter(
                                (channel) => channel.type === 13
                            ).size
                        } stage channel(s).
						${channels.cache.filter((channel) => channel.type === 0).size} text channel(s).
						Total channels: ${channels.channelCountWithoutThreads.toString()}`,
                },
                {
                    inline: true,
                    name: "Server Emote Count",
                    value: server.emojis.cache.size.toString(),
                },
                {
                    inline: true,
                    name: "Server Boosts",
                    value: `${server.premiumSubscriptionCount} (Tier ${server.premiumTier})`,
                }
            )
            .setTimestamp()
            .setFooter({ text: `Server ID: ${server.id}` });

        await interaction.editReply({
            embeds: [serverInfoEmbed],
        });
    },
};
