const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { currency } = require("../currencyUtils.js");
const { randInt } = require("../rand.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Displays the leaderboard."),
    async execute(interaction) {
        await interaction.deferReply();

        // Build embed message for the leaderboard
        const lbEmbed = new EmbedBuilder()
            .setColor([randInt(0, 255), randInt(0, 255), randInt(0, 255)])
            .setTitle(`${interaction.guild.name} Leaderboard`)
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();

        // Get and sort the currencies of users.
        const lb = currency
            .sort((a, b) => b.balance - a.balance)
            // Filter out any users that don't exist anymore.
            .filter((user) => interaction.client.users.cache.has(user.user_id))
            // Get the 10 richest users.
            .first(10)
            // Map the users to an easier to read array.
            .map(
                (user, position) =>
                    `${position + 1}. ${
                        interaction.client.users.cache.get(user.user_id).tag
                    }: ${user.balance}:coin:`
            )
            // Join the array into a string, elements separated by new lines.
            .join("\n");

        // Add the leaderboard to embed.
        lbEmbed.addFields({
            name: `Top 10`,
            value: lb,
        });

        await interaction.editReply({ embeds: [lbEmbed] });
    },
};
