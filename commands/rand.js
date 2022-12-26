const { SlashCommandBuilder } = require("discord.js");
const Rand = require("../rand.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rand")
        .setDescription("Provides a random number.")
        .addIntegerOption((option) =>
            option
                .setName("min")
                .setDescription("The smallest allowed integer (inclusive; between -9,999,999,999 and 9,999,999,999; 1 by default)")
                .setMinValue(-9999999999)
                .setMaxValue(9999999999)
        )
        .addIntegerOption((option) =>
            option
                .setName("max")
                .setDescription("The largest allowed integer (inclusive; between -9,999,999,999 and 9,999,999,999; 100 by default)")
                .setMinValue(-9999999999)
                .setMaxValue(9999999999)
        )
        .addIntegerOption((option) =>
            option
                .setName("count")
                .setDescription("How many numbers to generate (between 1 and 32; 1 by default)")
                .setMinValue(1)
                .setMaxValue(32)
        ),
    async execute(interaction) {
        const min = interaction.options.getInteger("min") ?? 1;
        const max = interaction.options.getInteger("max") ?? 100;
        const count = interaction.options.getInteger("count") ?? 1;
        const diff = max-min;

        if(diff < 0){
            await interaction.reply("The minimum should be smaller than maximum.");
            return;
        }

        let result = "";
        if(count == 1){
            result = `**Random number (${min} to ${max}):** ${Rand.randInt(min,max)}`;
        }else{
            result = `**${count} random numbers (${min} to ${max}):** ${Rand.randInt(min,max)}`;
            for (let i = 1; i < count; i++){
                result += ` ${Rand.randInt(min,max)}`;
            }
        }
        
        await interaction.reply(result);
    },
};