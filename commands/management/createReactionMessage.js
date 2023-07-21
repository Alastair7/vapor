const { SlashCommandBuilder } = require('discord.js')
const AutoroleMessage = require('../../models/autoroleMessages')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addreaction-to-message')
        .setDescription(
            'Add a message with a reaction that will add a specific role'
        )
        .addStringOption((option) =>
            option
                .setName('message')
                .setDescription('Message ID which will be added reactions')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('emoji')
                .setDescription('Emoji name')
                .setRequired(true)
        )
        .addRoleOption((option) =>
            option
                .setName('role')
                .setDescription('Role that will be added to user')
                .setRequired(true)
        ),
    async execute(interaction) {
        const channelId = await interaction.channelId
        const messageId = await interaction.options.getString('message')
        const emojiName = await interaction.options.getString('emoji')
        const roleName = await interaction.options.getRole('role').id

        const emojiMap = new Map([[emojiName, roleName]])

        console.log(
            `Searching AutoroleMessage ${messageId} within channel ${channelId}`
        )
        const existingMessage = await AutoroleMessage.findOne({
            channelId: channelId,
            messageId: messageId,
        })
        console.log(`Search result: ${existingMessage}`)

        console.log(`Retrieving message ID: ${messageId}`)
        const message = await interaction.channel.messages.fetch(`${messageId}`)
        console.log(`Retrieved message: ${messageId}`)

        // React to message
        console.log('Retrieving Guild Emojis')
        console.log(`Retrieved emojiName: ${emojiName}`)

        await message.react(emojiName)

        if (existingMessage == null) {
            try {
                const autoroleMessage = new AutoroleMessage({
                    channelId: channelId,
                    messageId: messageId,
                    emojiMap: emojiMap,
                })
                await autoroleMessage.save()
                console.log('AutoroleMessage added to database')
            } catch (error) {
                console.error('Error saving model', error)
            }
        } else if (
            existingMessage != null &&
            !existingMessage.emojiMap.has(emojiName)
        ) {
            existingMessage.emojiMap.set(emojiName, roleName)

            await existingMessage.save()
        }

        interaction.reply('Reacción añadida mi loco')
        console.log('SUCCESS')
    },
}
