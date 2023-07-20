const { Events, InteractionType, ChannelType } = require('discord.js');
const GameCategories = require('../commons/enums/gameCategories.js');

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
					let category = '';
					const lobbyName = interaction.fields.getTextInputValue('lobbyNameInput');
					console.log(`Obtained Lobby: ${lobbyName}`);

					const lobbyPlayers = interaction.fields.getTextInputValue('lobbyPlayersInput');
					console.log(`Obtained Players: ${lobbyPlayers}`);

					const gameSelected = interaction.fields.getTextInputValue('lobbyGameInput');
					console.log(`Obtained game: ${gameSelected}`);

					switch (gameSelected) {
					case 'lol': {
						category = guild.channels.cache.get(GameCategories.LeagueOfLegends);
						break;
					}
					case 'csgo': {
						interaction.reply('Not implemented yet');
						return;
					}
					default: {
						interaction.reply('Unknown game provided');
						return;
					}
					}
					console.log(`GameCategoryId: ${GameCategories.LeagueOfLegends}`);

					if (category) {
						await guild.channels.create({
							name: lobbyName,
							type: ChannelType.GuildVoice,
							userLimit:parseInt(lobbyPlayers),
							parent: category,
							// TO-DO: Deny access to Everyone role but the user creating the channel and the client.
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
