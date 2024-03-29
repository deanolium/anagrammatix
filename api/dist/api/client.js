"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("shared");
const game_1 = require("../game/game");
const clientHandler = (io, socket) => {
    const onJoinGame = (gameID) => {
        const playerData = {
            id: socket.id,
            name: socket.data.name,
        };
        const result = (0, game_1.addPlayerToGame)(gameID, playerData);
        if (!result) {
            socket.emit(shared_1.EVENTS.SERVER.ERROR, `Unable to add you to game ${gameID}`);
            return;
        }
        socket.send(`Joined game ${gameID}`);
        socket.to(gameID).emit(shared_1.EVENTS.SERVER.PLAYER_JOINED_ROOM, playerData);
        console.log(`Player ${socket.id} [${socket.data.name}] joined game ${gameID}`);
    };
    socket.on(shared_1.EVENTS.CLIENT.JOIN_GAME, onJoinGame);
};
exports.default = clientHandler;
