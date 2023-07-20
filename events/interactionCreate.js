const { Events, InteractionType } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const guild = interaction.guild;

		switch (interaction.type) {
		case InteractionType.ApplicationCommand:
		{
			console.log('Interaction Command Executed');
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found`);
				return;
			}

			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
			break;
		}
		case InteractionType.ModalSubmit: {
			if (interaction.customId === 'lobby-creation-modal') {
				console.log('Lobby Modal submitted');
				// Create Voice Channel
				try {
					// Get Modal Data

					const lobbyName = interaction.fields.getTextInputValue('lobbyNameInput');
					console.log(`Retrieved Lobby: ${lobbyName}`);
					const lobbyPlayers = interaction.fields.getTextInputValue('lobbyPlayersInput');
					console.log(`Retrieved Players: ${lobbyPlayers}`);

					const category = guild.channels.cache.get('1125860577831567360');

					if (category) {
						await guild.channels.create(lobbyName, {
							type: 'GUILD_VOICE',
							user_limit:lobbyPlayers,
						});

						await interaction.reply('SUCCESS');
					}
					else {
						console.error('Voice channel was not created');
					}

				}
				catch (error) {
					console.error('An error ocurred', error);
				}
			}
			break;
		}
		default:
			return;
		}
	},
};
