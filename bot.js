const fs = require('node:fs')
const path = require('node:path')
const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
} = require('discord.js')
const mongoose = require('mongoose')
const { Player } = require('discord-player')
const logger = require('./commons/Logging/winstonLogger')
const configuration = require('./config.json')

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction],
})

bot.commands = new Collection()

const relativePath = path.relative(process.cwd.toString(), __dirname)

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

const eventsPath = path.join(__dirname, 'events')
const eventsFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'))

commandFolders.forEach((folder) => {
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.js'))

    commandFiles.forEach((file) => {
        const filePath = path.join(commandsPath, file)
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const command = require(filePath)

        if ('data' in command && 'execute' in command) {
            bot.commands.set(command.data.name, command)
        } else {
            logger.warn(
                `Command at ${filePath} is missing a required "data" or "execute" property.`,
                { filePath: relativePath }
            )
        }
    })
})

eventsFiles.forEach((file) => {
    const filePath = path.join(eventsPath, file)
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const event = require(filePath)
    logger.info(`${event.name} [EVENT] ->> OK`, { filePath: relativePath })

    if (event.once) {
        bot.once(event.name, (...args) => event.execute(...args))
    } else {
        bot.on(event.name, (...args) => event.execute(...args))
    }
})
;(async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(configuration.dbConnectionString, {
            dbName: 'vaporDB',
        })
        logger.info('Database connection established succesfully.', {
            filePath: relativePath,
        })
    } catch (error) {
        logger.error(`Error: ${error}`, { filePath: relativePath })
    }
})()

const player = new Player(bot)
bot.player = player
player.extractors.loadDefault()

bot.login(configuration['bot-token'])
