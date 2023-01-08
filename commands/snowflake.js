const { SlashCommandBuilder } = require("discord.js");
const dayjs = require("dayjs");

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("snowflake")
        .setDescription(
            "Fetches the timestamp of a single message or time between two messages."
        )
        .addStringOption((option) =>
            option
                .setName("messageid1")
                .setDescription("ID of the first message.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("messageid2")
                .setDescription(
                    "ID of the second message. (leave blank if only message 1 timestamp needed)"
                )
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const messageId1 = interaction.options.getString("messageid1");

        if (!/^[0-9]+$/.test(messageId1)) {
            return await interaction.editReply(
                `Message IDs should only contain numbers.`
            );
        }
        if (Number(messageId1) < 4194304) {
            return await interaction.editReply(
                `Message IDs should be longer than that.`
            );
        }
        if (BigInt(messageId1) > BigInt("18446744073709551616")) {
            return await interaction.editReply(
                `Message IDs should be shorter than that.`
            );
        }

        const timestamp1 = Number(BigInt(messageId1) >> 22n);

        const messageId2 = interaction.options.getString("messageid2");

        if (!messageId2) {
            const unixTimestamp1 = timestamp1 + 1420070400000;
            const date1 = new Date(unixTimestamp1);
            const date1formatted = dayjs(date1).format(
                "YYYY-MM-DD HH:mm:ss.SSS"
            );

            return await interaction.editReply(
                `Message 1: ${messageId1}\nPosted at: ${date1formatted}`
            );
        }

        if (!/^\d+$/.test(messageId2)) {
            return await interaction.editReply(
                `Message IDs should only contain numbers.`
            );
        }
        if (Number(messageId2) < 4194304) {
            return await interaction.editReply(
                `Message IDs should be longer than that.`
            );
        }
        if (BigInt(messageId2) > BigInt("18446744073709551616")) {
            return await interaction.editReply(
                `Message IDs should be shorter than that.`
            );
        }

        const timestamp2 = Number(BigInt(messageId2) >> 22n);
        let difference = Math.abs(timestamp2 - timestamp1);
        let time = "";
        const hours = Math.floor(difference / 3600000);
        if (hours) {
            time += pad(hours, 2) + ":";
        }
        difference %= 3600000;
        const minutes = Math.floor(difference / 60000);
        time += pad(minutes, 2) + ":";
        difference %= 60000;
        const seconds = Math.floor(difference / 1000);
        time += pad(seconds, 2) + ".";
        const milliseconds = difference % 1000;
        time += pad(milliseconds, 3);

        await interaction.editReply(
            `Message 1: ${messageId1}\nMessage 2: ${messageId2}\nTime between: ${time}`
        );
    },
};
