const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

async function handleButtonInteraction(buttonInteraction) {
	if (buttonInteraction.isButton()) {
		if (buttonInteraction.customId === 'lobby_menu') {

			const lobbyModal = new ModalBuilder()
				.setCustomId('lobby-creation-modal')
				.setTitle('CREAR LOBBY');

			const lobbyNameInput = new TextInputBuilder()
				.setCustomId('lobbyNameInput')
				.setLabel('Nombre Lobby')
				.setStyle(TextInputStyle.Short)
				.setPlaceholder('Nombre de la sala');

			const lobbyPlayersInput = new TextInputBuilder()
				.setCustomId('lobbyPlayersInput')
				.setLabel('Jugadores')
				.setStyle(TextInputStyle.Short)
				.setPlaceholder('Número de jugadores');

			const lobbyGameInput = new TextInputBuilder()
				.setCustomId('lobbyGameInput')
				.setLabel('Juego')
				.setStyle(TextInputStyle.Short)
				.setPlaceholder('lol, rust, csgo, valorant...');

			const lobbyTypeInput = new TextInputBuilder()
				.setCustomId('lobbyTypeInput')
				.setLabel('Tipo')
				.setStyle(TextInputStyle.Short)
				.setPlaceholder('public o private');

			const nameActionRow = new ActionRowBuilder().addComponents(lobbyNameInput);
			const playersActionRow = new ActionRowBuilder().addComponents(lobbyPlayersInput);
			const gameActionRow = new ActionRowBuilder().addComponents(lobbyGameInput);
			const lobbyTypeActionRow = new ActionRowBuilder().addComponents(lobbyTypeInput);

			lobbyModal.addComponents(nameActionRow, playersActionRow, gameActionRow, lobbyTypeActionRow);

			await buttonInteraction.showModal(lobbyModal);
		}
		else if (buttonInteraction.customId === 'queue_menu') {
			await buttonInteraction.reply('Queue button clicked.');
			// TODO: Open Queue form [DO NOT IMPLEMENT YET]
		}
	}
}

module.exports = { handleButtonInteraction };