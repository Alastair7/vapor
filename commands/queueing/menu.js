const {
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
} = require('discord.js')

const path = require('path')

const logger = require('../../commons/Logging/winstonLogger')

const filePath = path.relative(process.cwd.toString(), __dirname)

const {
    validatePermissions,
} = require('../../commons/helpers/permissionHelper')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('menu')
        .setDescription('Opens ARKN features menu'),
    async execute(interaction) {
        logger.info('Validating member permissions', { filePath })
        const roleIsValid = await validatePermissions(interaction, 'menu')

        if (!roleIsValid) {
            await interaction.reply(
                "You don't have permissions to use this command."
            )
            return
        }

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
    },
}
