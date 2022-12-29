const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getInventory")
        .setDescription("Retreives a server member's inventory.")
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("The member to check.")
        ),
    async execute(interaction) {
        const member = interaction.options.getMember("member") ?? interaction.member;
        const user = await Users.findOne({ where: { user_id: member.id } });
        const items = await user.getItems();

        if (!items.length) return interaction.reply(`${member}'s inventory is empty.`);

        return interaction.reply(`${member} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
    },
};
