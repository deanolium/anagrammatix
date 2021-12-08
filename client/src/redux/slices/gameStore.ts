import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum GameState {
  NO_CONNECT,
  LOGIN_SCREEN,
  WAITING_FOR_PLAYERS,
  GAME_INTRO,
  ROUND_INTRO,
  IN_ROUND,
  SHOW_ROUND_SCORES,
  SHOW_GAME_SCORES,
  GAME_OVER,
}

interface IGameStoreState {
  message: string
  gameState: GameState
  gameID: string
  playerName: string
  players: string[]
  roundNumber?: number
  choices?: string[]
  gameScores: any[]
  roundResults?: any
}

const initialState: IGameStoreState = {
  message: 'No message',
  gameState: GameState.NO_CONNECT,
  gameID: '',
  playerName: '',
  players: [],
  gameScores: [],
}

const slice = createSlice({
  name: 'gameStore',
  initialState,
  reducers: {
    connected(state) {
      state.message = `Connected to main server`
      state.gameState = GameState.LOGIN_SCREEN
    },
    joinedGame(state, action: PayloadAction<any>) {},
    gameStarted(state) {},
    showRoundIntro(state) {},
    roundStarted(state, action: PayloadAction<any>) {},
    endOfRound(state, action: PayloadAction<any>) {},
    showEndOfGameResults(state, action: PayloadAction<any>) {},
    setEndOfGame(state) {},
    handleError(state, action: PayloadAction<string>) {
      state.message = `ERROR: ${action.payload}`
      console.error(action.payload)
    },
  },
})

export const {
  connected,
  joinedGame,
  gameStarted,
  showRoundIntro,
  roundStarted,
  endOfRound,
  showEndOfGameResults,
  setEndOfGame,
  handleError,
} = slice.actions

export default slice.reducer
