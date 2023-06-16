const { SlashCommandBuilder, MessageManager } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addReactionMessage')
		.setDescription('Add a message with a reaction that will add a specific role')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('Message ID which will be added reactions')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('emoji')
				.setDescription('Emoji name')
				.required(true))
		.addRoleOption(option =>
			option.setName('role')
				.setDescription('Role that will be added to user')
				.setRequired(true)),
	async execute(interaction) {
		// Get Current Channel
		// Get Message from channel
		const messageId = interaction.options.getString('message');
		const message = MessageManager.channel.messages.fetch(`${messageId}`);

		// React to message
		const emojiName = interaction.options.getString('emoji');
		const emoji = `/:${emojiName}:`;
		message.react(emoji);
	},
};