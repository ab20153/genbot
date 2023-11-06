const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { randInt } = require("../rand.js");
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
                    "ID of the second message. (optional)"
                )
        ),
    async execute(interaction) {
        await interaction.deferReply();

        // Get the id of the first message.
        const messageId1 = interaction.options.getString("messageid1");

        // Validate that the id is only numbers
        if (!(/^[0-9]+[-][0-9]+$/.test(messageId1) || /^[0-9]+$/.test(messageId1))) {
            return await interaction.editReply(
                `Message IDs should only contain numbers.`
            );
        }

        const dashLocation1 = messageId1.search('-');
        const id1 = messageId1.substring(dashLocation1 +1);

        // Validate that the id has at least 22 digits in its binary form.
        if (Number(id1) < 4194304) {
            return await interaction.editReply(
                `Message IDs should be longer than that.`
            );
        }
        // Validate that the id has no more than 64 digits in its binary form.
        if (BigInt(id1) > BigInt("18446744073709551616")) {
            return await interaction.editReply(
                `Message IDs should be shorter than that.`
            );
        }

        // Extract the timestamp from the id (the first 42 binary digits)
        const timestamp1 = Number(BigInt(id1) >> 22n);

        // Get the id of the second message
        const messageId2 = interaction.options.getString("messageid2");

        // Message id contains timestamp since 2015-01-01
        // 1420070400000 has to be added to
        // get the milliseconds since 1970-01-01
        const unixTimestamp1 = Math.round((timestamp1 + 1420070400000)/1000);

        // Making an embed for the response
        const snowflakeEmbed = new EmbedBuilder()
        .setColor([randInt(0, 255), randInt(0, 255), randInt(0, 255)])
        .setTitle("Snowflake")
        .addFields(
            {
                name: "Message 1",
                value: `id: \`${id1}\`\n<t:${unixTimestamp1}:F>`,
            }
        )
        .setTimestamp();

        // If no second message id provided, just return the timestamp of the first message
        if (!messageId2) {
            //return await interaction.editReply(
            //    `Message 1: ${messageId1}\nPosted at: ${date1formatted}`
            //);
            return await interaction.editReply({
                embeds: [snowflakeEmbed],
            });
        }

        // Same validation as before, this time for the second message id
        if (!(/^[0-9]+[-][0-9]+$/.test(messageId2) || /^[0-9]+$/.test(messageId2))) {
            return await interaction.editReply(
                `Message IDs should only contain numbers.`
            );
        }

        const dashLocation2 = messageId2.search('-');
        const id2 = messageId2.substring(dashLocation2 +1);

        if (Number(id2) < 4194304) {
            return await interaction.editReply(
                `Message IDs should be longer than that.`
            );
        }

        if (BigInt(id2) > BigInt("18446744073709551616")) {
            return await interaction.editReply(
                `Message IDs should be shorter than that.`
            );
        }

        // Extract timestamp from the second message id
        const timestamp2 = Number(BigInt(id2) >> 22n);
        const unixTimestamp2 = Math.round((timestamp2 + 1420070400000)/1000);
        // Get the time between the two messages
        let difference = Math.abs(timestamp2 - timestamp1);
        // Convert the time in milliseconds into a readable
        let time = "";
        const hours = Math.floor(difference / 3600000);
        time += pad(hours, 2) + ":";
        difference %= 3600000;
        const minutes = Math.floor(difference / 60000);
        time += pad(minutes, 2) + ":";
        difference %= 60000;
        const seconds = Math.floor(difference / 1000);
        time += pad(seconds, 2) + ".";
        const milliseconds = difference % 1000;
        time += pad(milliseconds, 3);

        snowflakeEmbed.addFields(
            {
                name: "Message 2",
                value: `id: \`${id2}\`\n<t:${unixTimestamp2}:F>`,
            },
            {
                name: "Time Between",
                value: time,
            }
        )

        //await interaction.editReply(
        //    `Message 1: ${id1}\nMessage 2: ${id2}\nTime between: ${time}`
        //);
        return await interaction.editReply({
            embeds: [snowflakeEmbed],
        });
    },
};
