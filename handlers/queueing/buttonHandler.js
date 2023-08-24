const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
} = require('discord.js')

const path = require('path')
const menuConfig = require('../../commons/configs/menuConfig')
const logger = require('../../commons/Logging/winstonLogger')

const filePath = path.relative(process.cwd.toString(), __dirname)

async function handleButtonInteraction(buttonInteraction) {
    if (buttonInteraction.isButton()) {
        if (buttonInteraction.customId === 'lobby_menu') {
            const lobbyModal = new ModalBuilder()
                .setCustomId('lobby-creation-modal')
                .setTitle('CREAR LOBBY')

            const menuInputs = menuConfig.map((input) => {
                return new TextInputBuilder()
                    .setCustomId(input.id)
                    .setLabel(input.label)
                    .setStyle(input.style)
                    .setPlaceholder(input.placeholder)
            })

            const components = menuInputs.map((component) => {
                return new ActionRowBuilder().addComponents(component)
            })

            lobbyModal.addComponents(...components)

            try {
                await buttonInteraction.showModal(lobbyModal)
            } catch (error) {
                logger.error(`An error occurred: ${error}`, { filePath })
            }
        } else if (buttonInteraction.customId === 'queue_menu') {
            // await buttonInteraction.reply('Queue button clicked.');
            // TODO: Open Queue form [DO NOT IMPLEMENT YET]
        }
    }
}

module.exports = { handleButtonInteraction }
