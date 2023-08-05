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

        // Feature: Delete a voice channel when there are no users connected
        if (!channel) return
        // Scenario: Voice Channel doesn't exist in any category
        // When: The channels were created by staff and they are public
        // Then: These channels are not deleted

        const channelCategory = channel.parentId
        const isGameCategory = checkCategoryExists(channelCategory)

        if (!isGameCategory) return
        // Scenario: Voice Channel exists in any category
        // When: Channel was created by member
        // Then: Channel waits 30 secs for users to connect
        // Then: Channel is deleted automatically

        if (channel.members.size <= 0) {
            setTimeout(async () => {
                await channel.delete()
            }, 30000)
        }
    },
}
