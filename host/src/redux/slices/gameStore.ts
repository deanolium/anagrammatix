import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum GameState {
  NO_CONNECT,
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
  players: string[]
  roundNumber?: number
  masterWord?: string
  gameScores: any[]
  roundResults?: any
}

const initialState: IGameStoreState = {
  message: 'No message',
  gameState: GameState.NO_CONNECT,
  gameID: '',
  players: [],
  gameScores: [],
}

const slice = createSlice({
  name: 'gameStore',
  initialState,
  reducers: {
    createdGame(state, action: PayloadAction<any>) {
      state.message = `Created game ${action.payload.gameID}`
      state.gameID = action.payload.gameID
      state.players = []
      state.gameState = GameState.WAITING_FOR_PLAYERS
    },
    playerJoined(state, action: PayloadAction<any>) {
      state.players.push(action.payload.name)
    },
    gameStarted(state) {
      state.gameState = GameState.GAME_INTRO
      state.gameScores = []
      state.roundNumber = 1
    },
    showRoundIntro(state) {
      state.gameState = GameState.ROUND_INTRO
    },
    roundStarted(state, action: PayloadAction<any>) {
      state.gameState = GameState.IN_ROUND
      state.masterWord = action.payload.masterWord
    },
    endOfRound(state, action: PayloadAction<any>) {
      const results = action.payload
      state.gameState = GameState.SHOW_ROUND_SCORES
      state.roundResults = results
      state.gameScores = results.playerScores
      state.roundNumber = (state.roundNumber || 0) + 1
    },
    endOfGameResults(state, action: PayloadAction<any>) {
      const results = action.payload
      state.gameState = GameState.SHOW_GAME_SCORES
      state.gameScores = results.playerScores
    },
    setEndOfGame(state) {
      state.gameState = GameState.GAME_OVER
    },
    handleError(state, action: PayloadAction<string>) {
      state.message = `ERROR: ${action.payload}`
      console.error(action.payload)
    },
  },
})

export const {
  createdGame,
  playerJoined,
  gameStarted,
  roundStarted,
  showRoundIntro,
  endOfRound,
  endOfGameResults,
  setEndOfGame,
  handleError,
} = slice.actions

export default slice.reducer
