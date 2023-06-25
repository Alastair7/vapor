const { Events } = require('discord.js');
const AutoroleMessage = require('../models/autoroleMessages.js');

module.exports = {
	name: Events.MessageReactionRemove,
	async execute(reaction, user) {
		const channelId = reaction.message.channel.id;

		if (channelId !== '1054096783397101678') {
			return;
		}

		const guild = reaction.message.guild;
		const messageId = reaction.message.id;

		const existentMessage = await AutoroleMessage.findOne({ channelId: channelId, messageId: messageId });

		if (existentMessage == null) return;

		const roleId = existentMessage.emojiMap.get(reaction.emoji.name);
		if (roleId == undefined) {
			console.log('Value not found in EmojiMap');
			return;
		}
		const role = guild.roles.cache.get(roleId);
		const member = guild.members.cache.get(user.id);

		await member.roles.remove(role);
	},
};