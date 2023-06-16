const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const configuration = require('./config.json');

const bot = new Client({
	intents:
	[
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
	],
	partials:
	[
		Partials.Channel,
		Partials.Message,
		Partials.Reaction,
	] });

bot.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const eventsPath = path.join(__dirname, 'events');
const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		if ('data' in command && 'execute' in command) {
			bot.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] Command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

for (const file of eventsFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	console.log(event);

	if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args));
	}
	else {
		bot.on(event.name, (...args) => event.execute(...args));
	}
}


bot.login(configuration['bot-token']);