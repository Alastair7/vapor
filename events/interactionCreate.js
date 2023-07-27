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
        let category = ''

        if (!lobbyName || !lobbyPlayers || !gameSelected) {
            await interaction.reply('Invalid lobby data provided')
            return
        }

        switch (gameSelected) {
            case 'lol': {
                category = guild.channels.cache.get(
                    GameCategories.LeagueOfLegends
                )
                if (!category) {
                    interaction.reply('No category found.')
                    return
                }
                break
            }
            case 'csgo': {
                category = guild.channels.cache.get(
                    GameCategories.CounterStrike
                )

                if (!category) {
                    interaction.reply('No category found')
                    return
                }
                break
            }
            case 'sot': {
                category = guild.channels.cache.get(GameCategories.SeaOfThieves)

                if (!category) {
                    interaction.reply('No category found')
                    return
                }
                break
            }
            case 'mh': {
                category = guild.channels.cache.get(
                    GameCategories.MonsterHunter
                )

                if (!category) {
                    interaction.reply('No category found')
                    return
                }
                break
            }
            case 'valorant': {
                category = guild.channels.cache.get(GameCategories.Valorant)

                if (!category) {
                    interaction.reply('No category found')
                    return
                }
                break
            }
            case 'r6': {
                category = guild.channels.cache.get(GameCategories.RainbowSix)

                if (!category) {
                    interaction.reply('No category found')
                    return
                }
                break
            }
            case 'cod': {
                category = guild.channels.cache.get(GameCategories.CallOfDuty)

                if (!category) {
                    interaction.reply('No category found')
                    return
                }
                break
            }
            case 'mc': {
                category = guild.channels.cache.get(GameCategories.Minecraft)

                if (!category) {
                    interaction.reply('No category found')
                    return
                }
                break
            }
            default: {
                interaction.reply('Unknown game provided')
                break
            }
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

        interaction.reply(`Channel created in category ${category}`)
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
