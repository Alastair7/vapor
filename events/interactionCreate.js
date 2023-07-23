const {
    Events,
    InteractionType,
    ChannelType,
    PermissionsBitField,
} = require('discord.js')

const path = require('path')

const logger = require('../commons/Logging/winstonLogger')

const filePath = path.relative(process.cwd.toString(), __dirname)

const GameCategories = require('../commons/enums/gameCategories')

async function generateLobby(guild, interaction) {
    try {
        const lobbyName = interaction.fields.getTextInputValue('lobbyNameInput')
        const lobbyPlayers =
            interaction.fields.getTextInputValue('lobbyPlayersInput')
        const gameSelected =
            interaction.fields.getTextInputValue('lobbyGameInput')

        if (!lobbyName || !lobbyPlayers || !gameSelected) {
            await interaction.reply('Invalid lobby data provided')
            return
        }

        switch (gameSelected) {
            case 'lol': {
                const category = guild.channels.cache.get(
                    GameCategories.LeagueOfLegends
                )
                if (!category) {
                    return
                }

                await guild.channels.create({
                    name: lobbyName,
                    type: ChannelType.GuildVoice,
                    userLimit: parseInt(lobbyPlayers, 10),
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.Connect],
                        },
                        {
                            id: guild.roles.everyone,
                            deny: [PermissionsBitField.Flags.Connect],
                        },
                    ],
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
        logger.error(`An error occurred during lobby creation: ${error}`, {
            filePath,
        })
    }
}
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const { guild } = interaction

        switch (interaction.type) {
            case InteractionType.ApplicationCommand: {
                const command = interaction.client.commands.get(
                    interaction.commandName
                )

                if (!command) {
                    return
                }

                try {
                    await command.execute(interaction)
                } catch (error) {
                    logger.error(`Error executing ${interaction.commandName}`, {
                        filePath,
                    })
                    logger.error(`${error}`, { filePath })
                }
                break
            }
            case InteractionType.ModalSubmit: {
                if (interaction.customId === 'lobby-creation-modal') {
                    await generateLobby(guild, interaction)
                }
                break
            }
            default:
        }
    },
}
