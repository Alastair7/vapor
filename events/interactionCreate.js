const {
    Events,
    InteractionType,
    ChannelType,
    PermissionsBitField,
} = require('discord.js')

const path = require('path')

const logger = require('../commons/Logging/winstonLogger')

const filePath = path.relative(process.cwd.toString(), __dirname)

const GameCategoriesID = require('../commons/enums/gameCategories')
const {
    handleButtonInteraction,
} = require('../handlers/queueing/buttonHandler')

function getModalInputValue(interaction, fieldID) {
    return interaction.fields.getTextInputValue(fieldID)
}

async function generateLobby(guild, interaction) {
    try {
        const lobbyName = getModalInputValue(interaction, 'lobbyNameInput')
        const lobbyPlayers = getModalInputValue(
            interaction,
            'lobbyPlayersInput'
        )
        const selectedGame = getModalInputValue(interaction, 'lobbyGameInput')

        if (!lobbyName || !lobbyPlayers || !selectedGame) {
            interaction.reply({
                content: 'Invalid lobby data provided',
                ephemeral: true,
            })
            return
        }
        const category =
            GameCategoriesID[selectedGame]?.() ?? GameCategoriesID.default()

        if (category === 'UNKNOWN') {
            await interaction.reply({
                content: 'Unknown Category',
                ephemeral: true,
            })
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

        interaction.reply({
            content: `Channel created in category ${category}`,
            ephemeral: true,
        })
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
            case InteractionType.MessageComponent: {
                if (interaction.customId === 'lobby_menu') {
                    await handleButtonInteraction(interaction)
                }
                break
            }
            default:
                break
        }
    },
}
