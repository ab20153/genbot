const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
    SlashCommandBuilder,
} = require("discord.js");
const { addBalance } = require("../currencyUtils.js");
const { randInt } = require("../rand.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("hilo")
        .setDescription(
            "Play a game of higher or lower. Answer correctly to earn 20 coins."
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const startNum = randInt(1, 100);

        let row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("higher")
                    .setLabel("Higher")
                    .setStyle(ButtonStyle.Success)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("lower")
                    .setLabel("Lower")
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.editReply({
            content: `Start number: ${startNum}\nA new number between 1 and 100 will be generated.\nWill it be higher or lower?`,
            components: [row],
        });

        interaction.client.on(Events.InteractionCreate, (interactionButton) => {
            if (!interactionButton.isButton()) return;
            if (interactionButton.user.id !== interaction.user.id) return;
            const newNum = randInt(1, 100);
            row.components.forEach((component) => {
                component.setDisabled(true);
            });
            if (interactionButton.customId.startsWith("higher")) {
                if (newNum > startNum) {
                    interactionButton.update({
                        content: `Start number: ${startNum}\nNew number: ${newNum}\nCorrect! You've earned 20 coins.`,
                        components: [row],
                    });
                    addBalance(interaction.user.id, 20);
                } else {
                    interactionButton.update({
                        content: `Start number: ${startNum}\nNew number: ${newNum}\nIncorrect!`,
                        components: [row],
                    });
                }
            } else if (interactionButton.customId.startsWith("lower")) {
                if (newNum < startNum) {
                    interactionButton.update({
                        content: `Start number: ${startNum}\nNew number: ${newNum}\nCorrect! You've earned 20 coins.`,
                        components: [row],
                    });
                    addBalance(interaction.user.id, 20);
                } else {
                    interactionButton.update({
                        content: `Start number: ${startNum}\nNew number: ${newNum}\nIncorrect!`,
                        components: [row],
                    });
                }
            }
        });
    },
};
