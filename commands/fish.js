const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../dbObjects.js");
const { addBalance, getItems } = require("../currencyUtils.js");
const { randInt } = require("../rand.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fish")
        .setDescription(
            "Use your fishing rod to catch some fish and sell them."
        ),
    async execute(interaction) {
        await interaction.deferReply();

        // Fetch the user running command from database
        const user = await Users.findOne({
            where: { user_id: interaction.member.id },
        });
        // Fetch the user's items
        const userItems = await getItems(user);

        // If the user has not bought the Fishing Rod item, they can't fish
        if (!userItems.find((i) => i.item.name === "Fishing Rod")) {
            return await interaction.editReply(
                "You should buy a fishing rod first."
            );
        }

        // Generate 1 of 5 possible outcomes with various levels of porbability
        // Add to user's balance based on the generated outcome
        switch (randInt(0, 11)) {
            case 0:
                await interaction.editReply(
                    "You caught a boot! Unfortunately, it's worth nothing."
                );
                break;
            case 1:
            case 2:
            case 3:
            case 4:
                addBalance(interaction.user.id, 15);
                await interaction.editReply(
                    "You caught a cod! It's a pretty common fish. 15 :coin: have been added to your balance."
                );
                break;
            case 6:
            case 7:
            case 8:
                addBalance(interaction.user.id, 30);
                await interaction.editReply(
                    "You caught a salmon! It's a fairly uncommon fish. 30 :coin: have been added to your balance."
                );
                break;
            case 9:
            case 10:
                addBalance(interaction.user.id, 50);
                await interaction.editReply(
                    "You caught a shark! That's a pretty rare one. 50 :coin: have been added to your balance."
                );
                break;
            case 11:
                addBalance(interaction.user.id, 100);
                await interaction.editReply(
                    "You caught a bag of money! That's a lucky catch. 100 :coin: have been added to your balance."
                );
        }
    },
};
