const { Events, InteractionType, ChannelType } = require('discord.js')
const GameCategories = require('../commons/enums/gameCategories')

async function generateLobby(guild, interaction) {
    try {
        const lobbyName = interaction.fields.getTextInputValue('lobbyNameInput')
        const lobbyPlayers =
            interaction.fields.getTextInputValue('lobbyPlayersInput')
        const gameSelected =
            interaction.fields.getTextInputValue('lobbyGameInput')

        if (!lobbyName || !lobbyPlayers || !gameSelected) {
            interaction.reply('Invalid lobby data provided')
            return
        }

        switch (gameSelected) {
            case 'lol': {
                const category = guild.channels.cache.get(
                    GameCategories.LeagueOfLegends
                )
                if (!category) {
                    console.error('Voice channel category not found')
                    return
                }

                await guild.channels.create({
                    name: lobbyName,
                    type: ChannelType.GuildVoice,
                    userLimit: parseInt(lobbyPlayers, 10),
                    parent: category,
                    // TO-DO: Deny access to Everyone role but the user creating the channel and the client.
                })

                await interaction.reply('SUCCESS')
                break
            }
            case 'csgo': {
                interaction.reply('Not implemented yet')
                break
            }
            default: {
                interaction.reply('Unknown game provided')
                break
            }
        }
    } catch (error) {
        console.error('An error occurred during lobby creation:', error)
    }
}
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const { guild } = interaction

        switch (interaction.type) {
            case InteractionType.ApplicationCommand: {
                console.log('Interaction Command Executed')
                const command = interaction.client.commands.get(
                    interaction.commandName
                )

                if (!command) {
                    console.error(
                        `No command matching ${interaction.commandName} was found`
                    )
                    return
                }

                try {
                    await command.execute(interaction)
                } catch (error) {
                    console.error(`Error executing ${interaction.commandName}`)
                    console.error(error)
                }
                break
            }
            case InteractionType.ModalSubmit: {
                if (interaction.customId === 'lobby-creation-modal') {
                    console.log('Lobby Modal submitted')
                    await generateLobby(guild, interaction)
                }
                break
            }
            default:
        }
    },
}
