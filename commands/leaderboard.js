const { SlashCommandBuilder, codeBlock } = require("discord.js");
const CurrencyUtils = require("../currencyUtils.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Displays the leaderboard."),
    async execute(interaction) {
        //console.log(Client.users)
        
        const lb = codeBlock(
			CurrencyUtils.currency.sort((a, b) => b.balance - a.balance)
				.filter(user => interaction.client.users.cache.has(user.user_id))
				.first(10)
				.map((user, position) => `(${position + 1}) ${(interaction.client.users.cache.get(user.user_id).tag)}: ${user.balance}`)
				.join('\n'),
		);

        return interaction.reply(lb);
    },
};
