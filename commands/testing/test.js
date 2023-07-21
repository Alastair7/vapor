const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test Command'),
    async execute(interaction) {
        await interaction.reply(
            'Primero que todo, cómo están los máquinas? Yo ya estoy conectado'
        )
    },
}
