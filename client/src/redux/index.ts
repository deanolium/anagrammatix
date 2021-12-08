import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { EVENTS, socketIOMiddleware } from 'shared'
import gameStoreReducer, {
  endOfRound,
  gameStarted,
  handleError,
  joinedGame,
  roundStarted,
  showEndOfGameResults,
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
          message: EVENTS.SERVER.PLAYER_JOINED_ROOM,
          action: joinedGame,
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
          action: showEndOfGameResults,
        },
        {
          message: EVENTS.SERVER.ERROR,
          action: handleError,
        },
      ],
      subscribers: [EVENTS.CLIENT.JOIN_GAME, EVENTS.CLIENT.PLAYER_ANSWER],
    }),
  ],
})

export type RootStateType = ReturnType<typeof rootReducers>
