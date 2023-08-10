const { SlashCommandBuilder } = require('discord.js')
const { useQueue } = require('discord-player')
const voiceHelper = require('../../commons/helpers/voiceHelper')
const {
    validatePermissions,
} = require('../../commons/helpers/permissionHelper')

async function getMusicPlayerStatus(queue) {
    if (!queue?.currentTrack) {
        return 'STOPPED'
    }
    if (queue.paused) {
        return 'PAUSED'
    }
    return 'PLAYING'
}
async function searchSong(searchQuery, musicPlayer) {
    const searchResult = await musicPlayer.search(searchQuery)

    if (!searchResult?.hasTracks()) return 'No tracks found'

    return searchResult
}

async function play(interaction, musicPlayer) {
    const voiceChannel = interaction.member.voice.channel

    if (!voiceHelper.isMemberInVoiceChannel(interaction)) {
        interaction.reply('You must be connected to a voice channel')
        return
    }

    const musicQuery = interaction.options.getString('song')

    await interaction.deferReply()

    const searchResult = await searchSong(musicQuery, musicPlayer)

    if (!searchResult)
        await interaction.followUp({
            content: 'No result found',
        })

    try {
        await musicPlayer.play(voiceChannel, searchResult, {
            nodeOptions: {
                metadata: {
                    channel: interaction.channel,
                    client: interaction.client,
                    requestedBy: interaction.user.username,
                },
                leaveOnEmptyCooldown: 300000,
                leaveOnEmpty: true,
                leaveOnEnd: false,
                bufferingTimeOut: 0,
                volume: 100,
                selfDeaf: false,
            },
        })
    } catch (error) {
        console.log(error)
    }

    await interaction.followUp({
        content: `⏱ | Loading your ${
            searchResult.playlist ? 'playlist' : 'track'
        }...`,
    })

    await interaction.followUp({
        content: 'Song added into the queue',
    })
}

async function stop(interaction) {
    if (!voiceHelper.isMemberInVoiceChannel(interaction)) {
        interaction.reply('You are not connected to a voice channel')
        return
    }

    await interaction.deferReply()
    const queue = useQueue(interaction.guild.id)

    const musicPlayerStatus = getMusicPlayerStatus(queue)

    if (musicPlayerStatus === 'STOPPED') {
        interaction.followUp('No song is playing')
        return
    }
    queue.node.stop()
    interaction.followUp('Song stopped')
}

async function pause(interaction) {
    if (!voiceHelper.isMemberInVoiceChannel(interaction)) {
        interaction.reply('You are not connected to a voice channel')
        return
    }

    await interaction.deferReply()
    const queue = useQueue(interaction.guild.id)

    const musicPlayerStatus = getMusicPlayerStatus(queue)

    if (musicPlayerStatus === 'PAUSED') {
        interaction.followUp('Song is already paused')
        return
    }
    queue.node.pause()
    interaction.followUp('Song is paused')
}

async function resume(interaction) {
    if (!interaction.member.voice.channel) {
        interaction.reply('You are not connected to a voice channel')
        return
    }

    await interaction.deferReply()
    const queue = useQueue(interaction.guild.id)

    if (!queue?.node.isPaused()) {
        interaction.followUp('Song is already playing')
        return
    }

    queue.node.resume()
    interaction.followUp('Song resumed')
}

async function skip(interaction) {
    if (!voiceHelper.isMemberInVoiceChannel(interaction)) {
        interaction.reply('You are not connected to a voice channel')
        return
    }

    const roleCanSkip = validatePermissions(interaction, 'MUSIC_SKIP')

    await interaction.deferReply()

    const queue = useQueue(interaction.guild.id)
    const musicPlayerStatus = getMusicPlayerStatus(queue)

    if ((await musicPlayerStatus) !== 'PLAYING') {
        await interaction.followUp('No track to skip')
        return
    }

    if (roleCanSkip) {
        queue.node.skip()
        await interaction.followUp('Song skipped by admin')
        return
    }

    await interaction
        .followUp('Collecting reactions to skip the song')
        .then((msg) => {
            msg.react('⭐')
            const filter = (reaction, user) => {
                return '⭐'.includes(reaction.emoji.name) && !user.bot
            }
            const reactionCollector = msg.createReactionCollector({
                filter,
                time: 15000,
            })

            reactionCollector.on('end', (collected) => {
                const membersConnected = queue.channel.members.filter(
                    (member) => !member.user.bot
                ).size

                if (
                    membersConnected === collected.size ||
                    collected.size >= Math.ceil(membersConnected / 2)
                ) {
                    queue.node.skip()
                    interaction.followUp('Song skipped')
                } else {
                    interaction.followUp('Not enough reactions collected')
                }
            })
        })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Access to music features')
        .addSubcommand((sc) => {
            return sc
                .setName('play')
                .setDescription(
                    'Play a song by name or URL. Playlist URL is supported as well.'
                )
                .addStringOption((option) => {
                    return option
                        .setName('song')
                        .setDescription('Song URL or name')
                })
        })
        .addSubcommand((sc) => {
            return sc
                .setName('stop')
                .setDescription('Stop playing the current song.')
        })
        .addSubcommand((sc) => {
            return sc
                .setName('resume')
                .setDescription('Resume the current song.')
        })
        .addSubcommand((sc) => {
            return sc.setName('pause').setDescription('Pause the current song.')
        })
        .addSubcommand((sc) => {
            return sc
                .setName('volume')
                .setDescription('Sets the song volume')
                .addStringOption((option) => {
                    return option
                        .setName('level')
                        .setDescription('Set the volume level')
                })
        })
        .addSubcommand((sc) => {
            return sc.setName('skip').setDescription('Skip current song')
        })
        .addSubcommandGroup((scGroup) => {
            return scGroup
                .setName('playlist')
                .setDescription('Get info about playlists or remove a playlist')
                .addSubcommand((sc) => {
                    return sc
                        .setName('info')
                        .setDescription('Get info about existing playlists')
                        .addStringOption((option) => {
                            return option
                                .setName('name')
                                .setDescription('Playlist name')
                                .setRequired(false)
                        })
                })
                .addSubcommand((sc) => {
                    return sc
                        .setName('remove')
                        .setDescription('Remove an existing playlist')
                        .addStringOption((option) => {
                            return option
                                .setName('name')
                                .setDescription('Playlist name to be removed')
                        })
                })
        }),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand()
        const musicPlayer = interaction.client.player

        switch (subcommand) {
            case 'play':
                await play(interaction, musicPlayer)
                break
            case 'stop':
                await stop(interaction)
                break
            case 'pause':
                await pause(interaction)
                break
            case 'resume':
                await resume(interaction)
                break
            case 'skip':
                await skip(interaction)
                break
            default:
                await interaction.reply('Unknown Subcommand')
                break
        }
    },
}
