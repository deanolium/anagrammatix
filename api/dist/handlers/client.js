"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("shared");
const game_1 = require("../game/game");
const clientHandler = (io, socket) => {
    const onJoinGame = ({ gameID, name }) => {
        socket.data.name = name;
        const playerData = {
            id: socket.id,
            name,
        };
        try {
            (0, game_1.addPlayerToGame)(gameID, playerData);
        }
        catch (error) {
            const e = error;
            console.log(e.message);
            socket.emit(shared_1.EVENTS.SERVER.ERROR, e.message);
            return;
        }
        socket.join(gameID);
        socket.send(`Joined game ${gameID}`);
        socket.to(gameID).emit(shared_1.EVENTS.SERVER.PLAYER_JOINED_ROOM, playerData);
        console.log(`Player ${socket.id} [${socket.data.name}] joined game ${gameID}`);
    };
    const onPlayerAnswer = ({ gameID, answer, }) => {
        try {
            (0, game_1.addPlayerAnswer)(gameID, socket.id, answer);
            socket.send(`Answer received`);
            console.log(`Player ${socket.id} [${socket.data.name}] provided an answer`);
            if ((0, game_1.hasAllPlayersAnswered)(gameID)) {
                let results = (0, game_1.scoreRound)(gameID);
                if (results.isGameOver) {
                    // game is over - so sort out the winners and all that
                    io.to(gameID).emit(shared_1.EVENTS.SERVER.GAME_OVER, results);
                    return;
                }
                // send across the winners/losers
                io.to(gameID).emit(shared_1.EVENTS.SERVER.END_OF_ROUND, results);
            }
        }
        catch (error) {
            const e = error;
            console.log(e.message);
            socket.emit(shared_1.EVENTS.SERVER.ERROR, e.message);
            return;
        }
    };
    socket.on(shared_1.EVENTS.CLIENT.JOIN_GAME, onJoinGame);
    socket.on(shared_1.EVENTS.CLIENT.PLAYER_ANSWER, onPlayerAnswer);
};
exports.default = clientHandler;
