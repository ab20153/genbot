const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require("discord.js");
const { CurrencyShop } = require("../dbObjects.js");
const { randInt } = require("../rand.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("Open the shop."),
    async execute(interaction) {
        await interaction.deferReply();

        const shop = new EmbedBuilder()
            .setColor([randInt(0, 255), randInt(0, 255), randInt(0, 255)])
            .setTitle(`${interaction.guild.name} Shop`);

        const items = await CurrencyShop.findAll();

        items.forEach((item) => {
            if(!item.deleted){
                shop.addFields({
                    name: `Item: ${item.name}`,
                    value: `Cost: ${item.cost}`,
                });
            }
        });

        return interaction.editReply({ embeds: [shop] });
    },
};
