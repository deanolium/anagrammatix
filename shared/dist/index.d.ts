export { default as socketIOMiddleware } from './middlewares/socketIOMiddleware';
export { ISocketConfig, IListener } from 'types';
export declare const EVENTS: {
    CLIENT: {
        CONNECT: string;
        DISCONNECT: string;
        CREATE_GAME: string;
        START_GAME: string;
        JOIN_GAME: string;
        PLAYER_ANSWER: string;
        START_ROUND: string;
        ROUND_TIMED_OUT: string;
        REQUEST_RESTART_GAME: string;
    };
    SERVER: {
        GAME_CREATED: string;
        PLAYER_JOINED_ROOM: string;
        BEGIN_NEW_GAME: string;
        NEW_ROUND_DATA: string;
        END_OF_ROUND: string;
        GAME_OVER: string;
        ERROR: string;
    };
};
