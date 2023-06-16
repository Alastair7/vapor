const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(reaction, user) {
		if (reaction.message.id === '1118996746597568723') {
			if (reaction.emoji.name === '😄') {
				const guild = reaction.message.guild;
				const member = guild.members.cache.get(user.id);

				const role = guild.roles.cache.find(r => r.name === 'Foreigner');

				console.log(`Adding role ${role.name} to ${member.user.tag}`);
				await member.roles.add(role);
				console.log(`Added role ${role.name} to ${member.user.tag}.`);
			}
		}
	},
};