const { Events } = require('discord.js')
const path = require('path')
const logger = require('../commons/Logging/winstonLogger')

const filePath = path.relative(process.cwd.toString(), __dirname)

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        logger.info(`${client.user.tag} is ONLINE`, { filePath })
    },
}
