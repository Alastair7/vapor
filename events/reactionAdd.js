const { Events } = require('discord.js')
const AutoroleMessage = require('../models/autoroleMessages')

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        const { message } = reaction.message
        const channelId = message.channel.id
        if (channelId !== '1054096783397101678') {
            return
        }

        const { guild } = message
        const messageId = message.id

        const existentMessage = await AutoroleMessage.findOne({
            channelId,
            messageId,
        })

        if (existentMessage != null) {
            const roleId = existentMessage.emojiMap.get(reaction.emoji.name)
            if (roleId === undefined) {
                console.log('Role not found in EmojiMap')
                return
            }
            console.log(roleId)
            const role = guild.roles.cache.get(roleId)
            const member = guild.members.cache.get(user.id)

            await member.roles.add(role)
        }
    },
}
