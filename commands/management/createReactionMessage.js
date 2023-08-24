const path = require('path')
const { SlashCommandBuilder } = require('discord.js')
const AutoroleMessage = require('../../models/autoroleMessages')
const logger = require('../../commons/Logging/winstonLogger')

const filePath = path.relative(process.cwd.toString(), __dirname)

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

        logger.info(
            `Searching AutoroleMessage ${messageId} in channel ${channelId}`,
            { filePath }
        )
        const existingMessage = await AutoroleMessage.findOne({
            channelId,
            messageId,
        })

        const message = await interaction.channel.messages.fetch(`${messageId}`)

        logger.info(`Retrieved message: ${messageId} in channel ${channelId}`, {
            filePath,
        })

        // React to message
        await message.react(emojiName)

        if (existingMessage == null) {
            try {
                const autoroleMessage = new AutoroleMessage({
                    channelId,
                    messageId,
                    emojiMap,
                })
                await autoroleMessage.save()
                logger.info('AutoroleMessage added to database', {
                    filePath,
                })
            } catch (error) {
                logger.error(`Error saving model into DB: ${error}`, {
                    filePath,
                })
            }
        } else if (
            existingMessage != null &&
            !existingMessage.emojiMap.has(emojiName)
        ) {
            existingMessage.emojiMap.set(emojiName, roleName)

            await existingMessage.save()
        }

        interaction.reply('Reaction added')
    },
}
