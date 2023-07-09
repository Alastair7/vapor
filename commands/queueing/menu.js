const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js');
const { handleButtonInteraction } = require('../../handlers/queueing/buttonHandler.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('menu')
		.setDescription('Opens ARKN features menu'),
	async execute(interaction) {
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('lobby_menu')
					.setLabel('Crear Lobby')
					.setStyle(1),
				new ButtonBuilder()
					.setCustomId('queue_menu')
					.setLabel('Buscar Jugadores')
					.setStyle(1),
			);

		await interaction.reply({
			components: [row],
		});


		const collector = interaction.channel.createMessageComponentCollector({
			filter: i => i.user.id === interaction.user.id,
			max: 1,
			time: 60000,
		});

		collector.on('collect', async (collectorInteraction) => {
			await handleButtonInteraction(collectorInteraction);
		});

		collector.on('end', () => {
			interaction.editReply({ components: [] });
		});
	},
};