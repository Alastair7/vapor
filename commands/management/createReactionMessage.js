const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addreaction-to-message')
		.setDescription('Add a message with a reaction that will add a specific role')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('Message ID which will be added reactions')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('emoji')
				.setDescription('Emoji name')
				.setRequired(true))
		.addRoleOption(option =>
			option.setName('role')
				.setDescription('Role that will be added to user')
				.setRequired(true)),
	async execute(interaction) {
		// Get Current Channel
		// Get Message from channel
		const messageId = await interaction.options.getString('message');
		console.log(`Retrieving message ID: ${messageId}`);
		const message = await interaction.channel.messages.fetch(`${messageId}`);
		console.log(`Retrieved message: ${messageId}`);

		// React to message
		console.log('Retrieving Guild Emojis');
		const emojiName = await interaction.options.getString('emoji');
		console.log(`Retrieved emojiName: ${emojiName}`);

		await message.react(emojiName);
		interaction.reply('Reacción añadida mi loco');
		console.log('SUCCESS');
	},
};