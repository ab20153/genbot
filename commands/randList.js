const { SlashCommandBuilder } = require("discord.js");
const Rand = require("../rand.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("randlist")
        .setDescription("Sorts a list of items in a random order.")
        .addStringOption((option) =>
            option
                .setName("items")
                .setDescription("The list of items to sort (separate with ;)")
                .setRequired(true)
        ),
    async execute(interaction) {
        const items = interaction.options.getString("items");
        const itemsArr = items.split(";");
        const itemsCount = itemsArr.length;
        
        if(itemsCount < 2){
            await interaction.reply("At least 2 options required (separate options using `;`)");
            return;
        }

        let arrLength = itemsCount;

        let result = `Here are your ${itemsCount} items in random order:`;

        for(arrLength; arrLength > 1; arrLength--){
            let select = Rand.randInt(0,arrLength-1);
            result += `\n${itemsArr[select]}`;
            itemsArr.splice(select,1);
        }

        result += `\n${itemsArr[0]}`;
        
        await interaction.reply(result);
    },
};
