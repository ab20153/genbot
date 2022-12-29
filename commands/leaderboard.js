const { SlashCommandBuilder } = require("discord.js");
const { currencyUtils } = require("../currencyUtils.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Displays the leaderboard."),
    async execute(interaction) {
        const lb = codeBlock(
			currency.sort((a, b) => b.balance - a.balance)
				.filter(user => client.users.cache.has(user.user_id))
				.first(10)
				.map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}💰`)
				.join('\n'),
		);

        return interaction.reply(lb);
    },
};
