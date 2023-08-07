const { SlashCommandBuilder } = require('discord.js')
const { QueryType } = require('discord-player')

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

        switch (subcommand) {
            case 'play':
                {
                    const voiceChannel = interaction.member.voice.channel
                    if (!voiceChannel) {
                        interaction.reply(
                            'You must be connected to a voice channel'
                        )
                        return
                    }

                    const musicPlayer = interaction.client.player
                    const musicQuery = interaction.options.getString('song')

                    await interaction.deferReply()

                    const searchResult = await musicPlayer.search(musicQuery)

                    if (!searchResult.hasTracks()) {
                        interaction.followUp({ content: 'No result found' })
                        return
                    }

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
                                volume: 10,
                            },
                        })

                        await interaction.followUp({
                            content: `⏱ | Loading your ${
                                searchResult.playlist ? 'playlist' : 'track'
                            }...`,
                        })
                    } catch (error) {
                        console.log(error)
                    }

                    await interaction.followUp({
                        content: 'Song added into the queue',
                    })
                }
                break
            case 'stop':
                break
            case 'resume':
                break
            default:
                break
        }
    },
}
