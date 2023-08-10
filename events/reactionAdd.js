const { Events } = require('discord.js')
const path = require('path')
const logger = require('../commons/Logging/winstonLogger')
const AutoroleMessage = require('../models/autoroleMessages')

const filePath = path.relative(process.cwd.toString(), __dirname)

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        console.log('Reaction Event Add Triggered')
        const { channelId, id, guild } = reaction.message
        console.log(channelId)
        if (channelId !== '1054096783397101678') {
            return
        }
        const messageId = id

        const existentMessage = await AutoroleMessage.findOne({
            channelId,
            messageId,
        })

        if (existentMessage != null) {
            const roleId = existentMessage.emojiMap.get(reaction.emoji.name)
            if (roleId === undefined) {
                logger.error('Role not found in EmojiMap', { filePath })
                return
            }
            const role = guild.roles.cache.get(roleId)
            const member = guild.members.cache.get(user.id)

            await member.roles.add(role)
        }
    },
}
