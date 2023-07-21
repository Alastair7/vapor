const {
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
} = require('discord.js')
const {
    handleButtonInteraction,
} = require('../../handlers/queueing/buttonHandler')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('menu')
        .setDescription('Opens ARKN features menu'),
    async execute(interaction) {
        console.log('Executing ARKN MENU')
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('lobby_menu')
                .setLabel('Crear Lobby')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('queue_menu')
                .setLabel('Buscar Jugadores')
                .setStyle(1)
        )

        await interaction.reply({
            components: [row],
        })
        console.log(`Menu Showed ${row}`)

        console.log('Collecting data')
        const collector =
            await interaction.channel.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
                max: 1,
                time: 60000,
            })
        console.log(`Data Collected ${collector}`)
        collector.on('collect', async (collectorInteraction) => {
            console.log(`On Collect activated ${collectorInteraction}`)
            await handleButtonInteraction(collectorInteraction)
            collector.stop()
        })

        collector.on('end', async () => {
            console.log('Data Collected')
            await interaction.editReply({
                content: 'Información procesada',
                components: [],
            })
        })
    },
}
