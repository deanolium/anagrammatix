"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("shared");
const nanoid_1 = require("nanoid");
const game_1 = require("../game/game");
// A map to keep track of which game is associated with a host
// This allows us to then know the game ID whenever a host talks to us
const hostGames = new Map();
// A handler to deal with messages from the host
const hostHandler = (io, socket) => {
    const onCreateGame = () => {
        // Lets first make a room id, making sure it doesn't exist
        // then join that room, and emit what the game code is
        // We should also make the game object...
        let gameID;
        // Create a unique game ID
        do {
            gameID = (0, nanoid_1.nanoid)(5);
        } while (io.sockets.adapter.rooms.has(gameID));
        socket.join(gameID);
        console.log(`Game created with id ${gameID}`);
        hostGames.set(socket.id, gameID);
        const newGame = (0, game_1.createNewGame)(gameID, socket.id);
        socket.emit(shared_1.EVENTS.SERVER.GAME_CREATED, { newGame });
    };
    const onStartGame = () => {
        // Deal with the host starting the game
        const gameID = hostGames.get(socket.id);
        if (!gameID) {
            socket.emit(shared_1.EVENTS.SERVER.ERROR, 'You need to create a game first');
            return;
        }
    };
    socket.on(shared_1.EVENTS.CLIENT.CREATE_GAME, onCreateGame);
    socket.on(shared_1.EVENTS.CLIENT.START_GAME, onStartGame);
};
exports.default = hostHandler;
