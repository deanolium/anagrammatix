export enum GameState {
  open,
  started,
  complete,
}

export interface IGame {
  gameID: string
  hostID: string
  gameState: GameState
  players: {
    id: string
    name: string
    score: number
    answeredThisRound: boolean
  }[]
  roundNumber: number
  words?: {
    masterWord: string
    choices: string[]
    correctWord: string
  }
  wordQueue: {
    id: string
    word: string
  }[]
}
