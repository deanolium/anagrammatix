"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreRound = exports.hasAllPlayersAnswered = exports.addPlayerAnswer = exports.setupNewRound = exports.addPlayerToGame = exports.startGame = exports.createNewGame = void 0;
const game_1 = require("../types/game");
const words_1 = __importDefault(require("./words"));
const shuffle_1 = __importDefault(require("lodash/shuffle"));
// The list of all games currently active
// This should be controlled by a manager ideally...
const AllGames = new Map();
// Functions for dealing with the game
const getGame = (gameID) => {
    const game = AllGames.get(gameID);
    if (!game) {
        throw Error(`No game found with ID: ${gameID}`);
    }
    return game;
};
const createNewGame = (gameID, hostID) => {
    const newGame = {
        gameID,
        hostID,
        gameState: game_1.GameState.open,
        players: [],
        roundNumber: 0,
        wordQueue: [],
    };
    AllGames.set(gameID, newGame);
    return newGame;
};
exports.createNewGame = createNewGame;
const startGame = (gameID) => {
    const game = getGame(gameID);
    game.gameState = game_1.GameState.started;
    game.roundNumber = 0;
    return game;
};
exports.startGame = startGame;
const addPlayerToGame = (gameID, playerData) => {
    // check the player isn't already added
    const game = getGame(gameID);
    if (game.players.some(({ id }) => id === playerData.id)) {
        throw Error(`Player ${playerData.id} [${playerData.name}] is already in game`);
    }
    if (game.gameState !== game_1.GameState.open) {
        throw Error(`Game has already started`);
    }
    game.players.push({
        id: playerData.id,
        name: playerData.name,
        score: 0,
        answeredThisRound: false,
    });
};
exports.addPlayerToGame = addPlayerToGame;
const setupNewRound = (gameID) => {
    const game = getGame(gameID);
    // reset all players for the round
    game.players.forEach(player => (player.answeredThisRound = false));
    // pick a word list to use
    const wordSet = words_1.default[0]; // [Math.floor(Math.random() * wordList.length)]
    // select the host word
    const shuffledCorrectWords = (0, shuffle_1.default)(wordSet.realWords);
    const hostWord = shuffledCorrectWords[0];
    // select the correct word
    const correctWord = shuffledCorrectWords[1];
    // pick some decoy words
    const decoyWords = (0, shuffle_1.default)(wordSet.decoyWords).slice(0, 4);
    // shuffle in the correct word
    const wordsToShow = (0, shuffle_1.default)([...decoyWords, correctWord]);
    // set this into the game
    game.words = {
        masterWord: hostWord,
        correctWord,
        choices: wordsToShow,
    };
    game.wordQueue = [];
    return game;
};
exports.setupNewRound = setupNewRound;
const addPlayerAnswer = (gameID, playerID, answer) => {
    const game = getGame(gameID);
    game.wordQueue.push({ id: playerID, word: answer });
    const player = game.players.find(player => player.id === playerID);
    player.answeredThisRound = true;
};
exports.addPlayerAnswer = addPlayerAnswer;
const hasAllPlayersAnswered = (gameID) => {
    const game = getGame(gameID);
    return game.players.every(player => player.answeredThisRound);
};
exports.hasAllPlayersAnswered = hasAllPlayersAnswered;
const scoreRound = (gameID) => {
    // Score the round
    // 5 points for first correct answer
    // -3 points for wrong answers or if the player timed out
    const game = getGame(gameID);
    let hadFirstWinner = false;
    game.wordQueue.forEach(({ id: playerID, word }) => {
        const thisPlayer = game.players.find(player => player.id === playerID);
        if (!hadFirstWinner && word === game.words?.correctWord) {
            thisPlayer.score += 5;
        }
        else if (word !== game.words?.correctWord) {
            thisPlayer.score -= 3;
        }
    });
    // punish all players who didn't answer
    game.players.forEach(player => {
        if (!player.answeredThisRound) {
            player.score -= 3;
        }
    });
    game.roundNumber++;
    return game;
};
exports.scoreRound = scoreRound;
