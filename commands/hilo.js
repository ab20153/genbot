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

        // Generate a random starting number.
        const startNum = randInt(1, 100);

        // Add buttons to the message.
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

        // Event listener for button clicks.
        interaction.client.on(Events.InteractionCreate, (interactionButton) => {
            if (!interactionButton.isButton()) return;
            // If the user who clicked the button is not the user
            // who ran /hilo, do nothing
            if (interactionButton.user.id !== interaction.user.id) return;
            
            // Generate a new number
            const newNum = randInt(1, 100);
            // Disable the buttons
            row.components.forEach((component) => {
                component.setDisabled(true);
            });

            // If the user guessed that the new number would be higher...
            if (interactionButton.customId.startsWith("higher")) {
                // ...and it is higher, award them.
                if (newNum > startNum) {
                    interactionButton.update({
                        content: `Start number: ${startNum}\nNew number: ${newNum}\nCorrect! You've earned 20 coins.`,
                        components: [row],
                    });
                    addBalance(interaction.user.id, 20);
                }
                // ...and it is lower, do nothing.
                else {
                    interactionButton.update({
                        content: `Start number: ${startNum}\nNew number: ${newNum}\nIncorrect!`,
                        components: [row],
                    });
                }
            }
            // If the user guessed that the new number would be lower...
            else if (interactionButton.customId.startsWith("lower")) {
                // ...and it is lower, award them.
                if (newNum < startNum) {
                    interactionButton.update({
                        content: `Start number: ${startNum}\nNew number: ${newNum}\nCorrect! You've earned 20 coins.`,
                        components: [row],
                    });
                    addBalance(interaction.user.id, 20);
                }
                // ...and it is higher, do nothing.
                else {
                    interactionButton.update({
                        content: `Start number: ${startNum}\nNew number: ${newNum}\nIncorrect!`,
                        components: [row],
                    });
                }
            }
        });
    },
};
