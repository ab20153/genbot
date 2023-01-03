const { SlashCommandBuilder } = require("discord.js");
const CurrencyUtils = require("../currencyUtils.js");
const { Users, CurrencyShop, UserItems } = require('../dbObjects.js');
const { Op } = require('sequelize');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item.")
        .addStringOption((option) =>
            option
                .setName("itemname")
                .setDescription("The item to buy")
                .setRequired(true)
        ),
    async execute(interaction) {
        const itemName = interaction.options.getString("itemname");
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });

        if (!item) return interaction.reply(`That item doesn't exist.`);
        if (item.cost > CurrencyUtils.getBalance(interaction.member.id)) {
            return interaction.reply(`You currently have ${CurrencyUtils.getBalance(interaction.member.id)}, but the ${item.name} costs ${item.cost}!`);
        }

        const user = await Users.findOne({ where: { user_id: interaction.member.id } });
        CurrencyUtils.addBalance(interaction.member.id, -item.cost);
        await CurrencyUtils.addItem(user,item);

        return interaction.reply(`You've bought: ${item.name}.`);
    },
};