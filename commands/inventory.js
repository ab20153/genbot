const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Users } = require("../dbObjects.js");
const { getItems } = require("../currencyUtils.js");
const { randInt } = require("../rand.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("Retreives a server member's inventory.")
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("The member to get inventory of.")
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const member =
            interaction.options.getMember("member") ?? interaction.member;
        const user = await Users.findOne({ where: { user_id: member.id } });
        const items = await getItems(user);

        const inventoryEmbed = new EmbedBuilder()
            .setColor([
                randInt(0, 255),
                randInt(0, 255),
                randInt(0, 255),
            ])
            .setTitle(`${member}'s inventory`)
            .setThumbnail(member.avatarURL())
            .setTimestamp()

        if (!items.length){
            inventoryEmbed.addFields({
                name: "There seems to be nothing here...",
				value: `${member.tag}'s inventory is empty.`
            })
            return await interaction.editReply({ embeds: [inventoryEmbed], ephemeral: true });
        }
            
        await items.forEach(i => {
            inventoryEmbed.addFields({
                name: i.item.name,
				value: `x${i.amount}`,
                inline: true
            })
        });

        await interaction.editReply({ embeds: [inventoryEmbed], ephemeral: true });
    },
};
