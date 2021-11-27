import { IGamePlayer } from './players'

export enum GameState {
  open,
  started,
  complete,
}

export interface IGame {
  gameID: string
  hostID: string
  gameState: GameState
  players: IGamePlayer[]
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
