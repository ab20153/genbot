const { SlashCommandBuilder } = require("discord.js");
const { currencyUtils } = require("../currencyUtils.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item.")
        .addStringOption((option) =>
            option
                .setName("itemName")
                .setDescription("The item to buy")
                .setRequired(true)
        ),
    async execute(interaction) {
        const itemName = interaction.options.getString("itemName");
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });

        if (!item) return interaction.reply(`That item doesn't exist.`);
        if (item.cost > getBalance(interaction.user.id)) {
            return interaction.reply(`You currently have ${currencyUtils.getBalance(interaction.user.id)}, but the ${item.name} costs ${item.cost}!`);
        }

        const user = await Users.findOne({ where: { user_id: interaction.user.id } });
        addBalance(interaction.user.id, -item.cost);
        await user.addItem(item);

        return interaction.reply(`You've bought: ${item.name}.`);
    },
};
