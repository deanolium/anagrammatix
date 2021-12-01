"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENTS = exports.socketIOMiddleware = void 0;
var socketIOMiddleware_1 = require("./middlewares/socketIOMiddleware");
Object.defineProperty(exports, "socketIOMiddleware", { enumerable: true, get: function () { return __importDefault(socketIOMiddleware_1).default; } });
exports.EVENTS = {
    CLIENT: {
        CONNECT: 'connection',
        DISCONNECT: 'disconnect',
        CREATE_GAME: 'host:createGame',
        START_GAME: 'host:startGame',
        JOIN_GAME: 'client:joinGame',
        PLAYER_ANSWER: 'client:playerAnswer',
        START_ROUND: 'host:startRound',
        ROUND_TIMED_OUT: 'host:roundTimedOut',
        REQUEST_RESTART_GAME: 'host:reqRestartGame',
    },
    SERVER: {
        GAME_CREATED: 'server:gameCreated',
        PLAYER_JOINED_ROOM: 'server:playerJoinedRoom',
        BEGIN_NEW_GAME: 'server:beginNewGame',
        NEW_ROUND_DATA: 'server:newRoundData',
        END_OF_ROUND: 'server:endOfRound',
        GAME_OVER: 'server:gameOver',
        ERROR: 'error',
    },
};
