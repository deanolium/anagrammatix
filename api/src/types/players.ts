export interface IPlayer {
  id: string
  name: string
}

export interface IGamePlayer {
  id: string
  name: string
  score: number
  answeredThisRound: boolean
}
