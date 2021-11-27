"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENTS = void 0;
exports.EVENTS = {
    CLIENT: {
        CONNECT: 'connection',
        DISCONNECT: 'disconnect',
        CREATE_GAME: 'host:createGame',
        START_GAME: 'host:startGame',
        JOIN_GAME: 'client:joinGame',
        PLAYER_ANSWER: 'client:playerAnswer',
        START_FIRST_ROUND: 'host:startFirstRound',
        START_NEXT_ROUND: 'host:startNextRound',
        PLAYER_RESTART_GAME: 'client:playerRestartGame', //
    },
    SERVER: {
        GAME_CREATED: 'server:gameCreated',
        PLAYER_JOINED_ROOM: 'server:playerJoinedRoom',
        BEGIN_NEW_GAME: 'server:beginNewGame',
        NEW_ROUND_DATA: 'server:newRoundData',
        GAME_OVER: 'server:gameOver',
        ERROR: 'error',
    },
};
