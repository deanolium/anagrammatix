export declare const EVENTS: {
    CLIENT: {
        CONNECT: string;
        DISCONNECT: string;
        CREATE_GAME: string;
        START_GAME: string;
        JOIN_GAME: string;
        PLAYER_ANSWER: string;
        START_FIRST_ROUND: string;
        START_NEXT_ROUND: string;
        PLAYER_RESTART_GAME: string;
    };
    SERVER: {
        GAME_CREATED: string;
        PLAYER_JOINED_ROOM: string;
        BEGIN_NEW_GAME: string;
        NEW_ROUND_DATA: string;
        GAME_OVER: string;
        ERROR: string;
    };
};
