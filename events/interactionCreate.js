const {
    Events,
    InteractionType,
    ChannelType,
    PermissionsBitField,
    EmbedBuilder,
} = require('discord.js')

const path = require('path')

const logger = require('../commons/Logging/winstonLogger')

const filePath = path.relative(process.cwd.toString(), __dirname)

const GameCategoriesID = require('../commons/enums/gameCategories')
const NotificationChannelsID = require('../commons/enums/notificationsChannels')
const {
    handleButtonInteraction,
} = require('../handlers/queueing/buttonHandler')

function getModalInputValue(interaction, fieldID) {
    return interaction.fields.getTextInputValue(fieldID)
}

async function sendNotification(interaction, selectedGame, newChannel) {
    // Feature: Send notification to category's notification channel.
    // Given the guild member has selected Create Lobby from the menu
    // When channel is already created
    // Then an embed message is sent to the notification channel
    const notificationEmbed = new EmbedBuilder()
        .setTitle('LOBBY CREATED')
        .setAuthor({
            name: interaction.member.displayName,
            iconURL: interaction.member.displayAvatarURL({
                forceStatic: false,
                size: 1024,
            }),
        })
        .setDescription('Looking for players')
        .setThumbnail(
            interaction.guild.iconURL({
                forceStatic: false,
                size: 2048,
            })
        )
        .addFields(
            {
                name: 'Channel',
                value: `${newChannel.toString()}`,
                inline: true,
            },
            {
                name: 'Max Players',
                value: `${newChannel.userLimit}`,
                inline: true,
            }
        )
        .setColor('#d95033')
        .setTimestamp()
        .setFooter({
            text: 'Lobby will be deleted automatically within 30 secs if remains empty',
            iconURL: interaction.client.user.displayAvatarURL(),
        })

    const notificationChannel =
        NotificationChannelsID[selectedGame]?.() ??
        NotificationChannelsID.default()

    if (notificationChannel === 'UNKNOWN') {
        await interaction.reply({
            content: 'Notification Channel not found',
            ephemeral: true,
        })
        return
    }

    interaction.guild.channels.cache
        .get(notificationChannel)
        .send({ embeds: [notificationEmbed] })
}

async function generateLobby(guild, interaction) {
    try {
        const lobbyName = getModalInputValue(interaction, 'lobbyNameInput')
        const lobbyPlayers = getModalInputValue(
            interaction,
            'lobbyPlayersInput'
        )
        const selectedGame = getModalInputValue(interaction, 'lobbyGameInput')
        const lobbyType = getModalInputValue(interaction, 'lobbyTypeInput')
        let newChannel
        if (!lobbyName || !lobbyPlayers || !selectedGame || !lobbyType) {
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

        if (lobbyType === 'public') {
            newChannel = await guild.channels.create({
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
                        allow: [PermissionsBitField.Flags.Connect],
                    },
                ],
            })
        } else {
            newChannel = await guild.channels.create({
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
        }

        if (lobbyType === 'public') {
            await sendNotification(interaction, selectedGame, newChannel)
        }

        interaction.reply({
            content: `Lobby created ->> ${newChannel.toString()}`,
            ephemeral: true,
        })

        setTimeout(async () => {
            if (newChannel.members.size <= 0) {
                await newChannel.delete()
            }
        }, 30000)
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
