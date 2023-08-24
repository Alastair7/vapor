const { Events } = require('discord.js')
const GameCategoriesID = require('../commons/enums/gameCategories')

function checkCategoryExists(channelCategory) {
    const gameCategoriesIds = Object.values(GameCategoriesID).map((fn) => fn())
    const exists = gameCategoriesIds.includes(channelCategory)

    return exists
}
module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const { channel } = newState

        if (!channel) return

        const channelCategory = channel.parentId
        const isGameCategory = checkCategoryExists(channelCategory)

        if (!isGameCategory) return

        if (channel.members.size <= 0) {
            setTimeout(async () => {
                await channel.delete()
            }, 30000)
        }
    },
}
