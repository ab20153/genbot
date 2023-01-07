const { SlashCommandBuilder, EmbedBuilder, inlineCode, italic } = require("discord.js");
const Rand = require("../rand.js");
const fs = require("node:fs"); //node's file system module

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Information about the bot's commands."),
    async execute(interaction) {
        let commandList = "";
        const commandFiles = fs
            .readdirSync("./commands")
            .filter((file) => file.endsWith(".js"));
        
        for (const file of commandFiles) {
            const command = require(`./${file}`);
            commandList += `${inlineCode(command.data.name)}\t${italic(command.data.description)}\n`;
        }
        return await interaction.reply({ content: commandList, ephemeral: true });

        // const serverInfoEmbed = new EmbedBuilder()
        //     .setColor([
        //         Rand.randInt(0, 255),
        //         Rand.randInt(0, 255),
        //         Rand.randInt(0, 255),
        //     ])
        //     .setTitle(server.name)
        //     .setThumbnail(server.iconURL())
        //     .addFields(
		// 		{ 
		// 			name: "Description",
		// 			value: server.description ?? '*no description*'
		// 		},
        //         { 
		// 			name: "Server Owner",
		// 			value: `<@${server.ownerId}>`
		// 		},
        //         {
        //             name: "Server Created",
        //             value: dayjs(server.createdAt).format(
        //                 "ddd, MMM D, YYYY, HH:mm:ss"
        //             ),
        //         },
        //         {
        //             inline: true,
        //             name: "Member Count",
        //             value: 
		// 				`${members.cache.filter(member => !member.user.bot).size} human(s).
		// 				${bots} bot(s).
		// 				Total users: ${server.memberCount.toString()}`
        //         },
		// 		{
        //             inline: true,
        //             name: "Roles",
        //             value: 
		// 				`${roles.cache.size.toString()} role(s).
		// 				${roles.highest.toString()} is the highest role.`
        //         },
		// 		{
        //             inline: true,
        //             name: "Channel Count",
        //             value: 
		// 				`${channels.cache.filter(channel => channel.type === 4).size} categorie(s).
		// 				${channels.cache.filter(channel => channel.type === 5).size} announcement channel(s).
		// 				${channels.cache.filter(channel => channel.type === 2).size} voice channel(s).
		// 				${channels.cache.filter(channel => channel.type === 13).size} stage channel(s).
		// 				${channels.cache.filter(channel => channel.type === 0).size} text channel(s).
		// 				Total channels: ${channels.channelCountWithoutThreads.toString()}`
        //         },
		// 		{
        //             inline: true,
        //             name: "Server Emote Count",
        //             value: server.emojis.cache.size.toString()
        //         },
		// 		{
        //             inline: true,
        //             name: "Server Boosts",
        //             value: `${server.premiumSubscriptionCount} (Tier ${server.premiumTier})`
        //         }
        //     )
        //     .setTimestamp()
        //     .setFooter({ text: `Server ID: ${server.id}` });

		// await interaction.reply({
        //     embeds: [serverInfoEmbed],
        // });
    },
};
