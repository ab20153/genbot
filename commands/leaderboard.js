const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { currency } = require("../currencyUtils.js");
const { randInt } = require("../rand.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Displays the leaderboard."),
    async execute(interaction) {
        await interaction.deferReply();
        const lbEmbed = new EmbedBuilder()
            .setColor([randInt(0, 255), randInt(0, 255), randInt(0, 255)])
            .setTitle(`${interaction.guild.name} Leaderboard`)
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();

        const lb = currency
            .sort((a, b) => b.balance - a.balance)
            .filter((user) => interaction.client.users.cache.has(user.user_id))
            .first(10)
            .map(
                (user, position) =>
                    `${position + 1}. ${
                        interaction.client.users.cache.get(user.user_id).tag
                    }: ${user.balance}:coin:`
            )
            .join("\n");

        lbEmbed.addFields({
            name: `Top 10`,
            value: lb,
        });

        await interaction.editReply({ embeds: [lbEmbed] });
    },
};
