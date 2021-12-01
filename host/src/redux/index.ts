// Do the redux stuff here

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { EVENTS, socketIOMiddleware } from 'shared'
import gameStoreReducer, {
  createdGame,
  endOfGameResults,
  endOfRound,
  gameStarted,
  handleError,
  playerJoined,
  roundStarted,
} from './slices/gameStore'

export const rootReducers = combineReducers({
  gameStore: gameStoreReducer,
})

export const rootStore = configureStore({
  reducer: rootReducers,
  middleware: [
    socketIOMiddleware({
      apiURL: 'localhost:3001',
      role: 'host',
      listeners: [
        {
          message: EVENTS.SERVER.GAME_CREATED,
          action: createdGame,
        },
        {
          message: EVENTS.SERVER.PLAYER_JOINED_ROOM,
          action: playerJoined,
        },
        {
          message: EVENTS.SERVER.BEGIN_NEW_GAME,
          action: gameStarted,
        },
        {
          message: EVENTS.SERVER.NEW_ROUND_DATA,
          action: roundStarted,
        },
        {
          message: EVENTS.SERVER.END_OF_ROUND,
          action: endOfRound,
        },
        {
          message: EVENTS.SERVER.GAME_OVER,
          action: endOfGameResults,
        },
        {
          message: EVENTS.SERVER.ERROR,
          action: handleError,
        },
      ],
      subscribers: [
        EVENTS.CLIENT.CREATE_GAME,
        EVENTS.CLIENT.REQUEST_RESTART_GAME,
        EVENTS.CLIENT.START_GAME,
        EVENTS.CLIENT.START_ROUND,
        EVENTS.CLIENT.ROUND_TIMED_OUT,
      ],
    }),
  ],
})

export type RootStateType = ReturnType<typeof rootReducers>
