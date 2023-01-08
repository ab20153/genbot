const { SlashCommandBuilder } = require("discord.js");
const { Users } = require('../dbObjects.js');
const CurrencyUtils = require("../currencyUtils.js");
const Rand = require("../rand.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fish")
        .setDescription(
            "Use your fishing rod to catch some fish and sell them."
        ),
    async execute(interaction) {
        const user = await Users.findOne({ where: { user_id: interaction.member.id } });
        const userItems = await CurrencyUtils.getItems(user);
        if(!userItems.find(i => i.item.name === "Fishing Rod")){
            return await interaction.reply("You should buy a fishing rod first.");
        }
        switch(Rand.randInt(0,11)){
            case 0:
                await interaction.reply("You caught a boot! Unfortunately, it's worth nothing.");
                break;
            case 1:
            case 2:
            case 3:
            case 4:
                CurrencyUtils.addBalance(interaction.user.id,15);
                await interaction.reply("You caught a cod! It's a pretty common fish. 15 coins have been added to your balance.");
                break;
            case 6:
            case 7:
            case 8:
                CurrencyUtils.addBalance(interaction.user.id,30);
                await interaction.reply("You caught a salmon! It's a fairly uncommon fish. 30 coins have been added to your balance.");
                break;
            case 9:
            case 10:
                CurrencyUtils.addBalance(interaction.user.id,50);
                await interaction.reply("You caught a shark! That's a pretty rare one. 50 coins have been added to your balance.");
                break;
            case 11:
                CurrencyUtils.addBalance(interaction.user.id,100);
                await interaction.reply("You caught a bag of money! That's a lucky catch. 100 coins have been added to your balance.");
        }
    },
};
