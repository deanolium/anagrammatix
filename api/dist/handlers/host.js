"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("shared");
const nanoid_1 = require("nanoid");
const nanoid_dictionary_1 = require("nanoid-dictionary");
const game_1 = require("../game/game");
const generateID = (0, nanoid_1.customAlphabet)(nanoid_dictionary_1.lowercase, 5);
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
            gameID = generateID();
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
        const game = (0, game_1.startGame)(gameID);
        // Tell everyone that the game is about to begin
        // The host will then wait a few seconds before starting the first round
        // creating anticipation...
        io.to(gameID).emit(shared_1.EVENTS.SERVER.BEGIN_NEW_GAME, game);
    };
    const onStartRound = () => {
        // The host is telling us to start the round
        const gameID = hostGames.get(socket.id);
        if (!gameID) {
            socket.emit(shared_1.EVENTS.SERVER.ERROR, 'You need to create a game first');
            return;
        }
        const game = (0, game_1.setupNewRound)(gameID);
        // give each player the choices
        socket
            .to(gameID)
            .emit(shared_1.EVENTS.SERVER.NEW_ROUND_DATA, { choices: game.words?.choices });
        // give the host the host word
        socket.emit(shared_1.EVENTS.SERVER.NEW_ROUND_DATA, {
            masterWord: game.words?.masterWord,
        });
    };
    const onRoundTimeOut = () => {
        // The time is up, so do the score and check to see if it's game over
        const gameID = hostGames.get(socket.id);
        if (!gameID) {
            socket.emit(shared_1.EVENTS.SERVER.ERROR, 'You need to create a game first');
            return;
        }
        let results = (0, game_1.scoreRound)(gameID);
        if (results.isGameOver) {
            // game is over - so sort out the winners and all that
            io.to(gameID).emit(shared_1.EVENTS.SERVER.GAME_OVER, results);
            return;
        }
        // send across the winners/losers
        io.to(gameID).emit(shared_1.EVENTS.SERVER.END_OF_ROUND, results);
    };
    const onRequestRestartGame = () => {
        const gameID = hostGames.get(socket.id);
        if (!gameID) {
            socket.emit(shared_1.EVENTS.SERVER.ERROR, 'You need to create a game first');
            return;
        }
        const game = (0, game_1.startGame)(gameID);
        // Tell everyone that the game is about to begin
        // The host will then wait a few seconds before starting the first round
        // creating anticipation...
        io.to(gameID).emit(shared_1.EVENTS.SERVER.BEGIN_NEW_GAME, game);
    };
    socket.on(shared_1.EVENTS.CLIENT.CREATE_GAME, onCreateGame);
    socket.on(shared_1.EVENTS.CLIENT.START_GAME, onStartGame);
    socket.on(shared_1.EVENTS.CLIENT.START_ROUND, onStartRound);
    socket.on(shared_1.EVENTS.CLIENT.ROUND_TIMED_OUT, onRoundTimeOut);
    socket.on(shared_1.EVENTS.CLIENT.REQUEST_RESTART_GAME, onRequestRestartGame);
};
exports.default = hostHandler;
