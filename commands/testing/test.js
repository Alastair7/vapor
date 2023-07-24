const { SlashCommandBuilder } = require('discord.js')
const {
    validatePermissions,
} = require('../../commons/helpers/permissionHelper')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test Command'),
    async execute(interaction) {
        const isValid = await validatePermissions(interaction, 'test')

        if (!isValid) {
            await interaction.reply(
                "You don't have permissions to use this command."
            )
            return
        }
        await interaction.reply(
            'Primero que todo, cómo están los máquinas? Yo ya estoy conectado'
        )
    },
}
