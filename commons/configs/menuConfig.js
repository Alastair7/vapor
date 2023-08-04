const { TextInputStyle } = require('discord.js')

const menuConfig = [
    {
        id: 'lobbyNameInput',
        label: 'Nombre Lobby',
        style: TextInputStyle.Short,
        placeholder: 'Nombre de la sala',
    },
    {
        id: 'lobbyPlayersInput',
        label: 'Jugadores',
        style: TextInputStyle.Short,
        placeholder: 'Número de jugadores',
    },
    {
        id: 'lobbyGameInput',
        label: 'Juego',
        style: TextInputStyle.Short,
        placeholder: 'lol, mh, cod, cs, valorant, mc, r6, sot',
    },
    {
        id: 'lobbyTypeInput',
        label: 'Tipo',
        style: TextInputStyle.Short,
        placeholder: 'public or private',
    },
]

module.exports = menuConfig
