const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(user, reaction, messageId, emojiName, roleName) {
		console.log(reaction);
		if (reaction.message.id === messageId) {
			if (reaction.emoji.name === emojiName) {
				const guild = reaction.message.guild;
				const member = guild.members.cache.get(user.id);

				const role = guild.roles.cache.find(r => r.name === roleName);

				console.log(`Adding role ${role.name} to ${member.user.tag}`);
				await member.roles.add(role);
				console.log(`Added role ${role.name} to ${member.user.tag}.`);
			}
		}
	},
};