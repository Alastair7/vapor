const voiceHelper = {
    isMemberInVoiceChannel(interaction) {
        return !!interaction.member.voice.channel
    },
}
module.exports = voiceHelper
