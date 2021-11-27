export const EVENTS = {
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
}
