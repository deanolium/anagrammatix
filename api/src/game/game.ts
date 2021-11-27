import { GameState, IGame } from '../types/game'
import { IPlayers } from '../types/players'
import wordList from './words'
import shuffle from 'lodash/shuffle'

// The list of all games currently active
// This should be controlled by a manager ideally...
const AllGames = new Map<string, IGame>()

// Functions for dealing with the game
const getGame = (gameID: string): IGame => {
  const game = AllGames.get(gameID)

  if (!game) {
    throw Error(`No game found with ID: ${gameID}`)
  }

  return game
}

export const createNewGame = (gameID: string, hostID: string) => {
  const newGame: IGame = {
    gameID,
    hostID,
    gameState: GameState.open,
    players: [],
    roundNumber: 0,
    wordQueue: [],
  }

  AllGames.set(gameID, newGame)

  return newGame
}

export const startGame = (gameID: string) => {
  const game = getGame(gameID)
  game.gameState = GameState.started
  game.roundNumber = 0

  return game
}

export const addPlayerToGame = (gameID: string, playerData: IPlayers) => {
  // check the player isn't already added
  const game = getGame(gameID)

  if (game.players.some(({ id }) => id === playerData.id)) {
    throw Error(
      `Player ${playerData.id} [${playerData.name}] is already in game`
    )
  }

  if (game.gameState !== GameState.open) {
    throw Error(`Game has already started`)
  }

  game.players.push({
    id: playerData.id,
    name: playerData.name,
    score: 0,
    answeredThisRound: false,
  })
}

export const setupNewRound = (gameID: string) => {
  const game = getGame(gameID)

  // reset all players for the round
  game.players.forEach(player => (player.answeredThisRound = false))

  // pick a word list to use
  const wordSet = wordList[0] // [Math.floor(Math.random() * wordList.length)]

  // select the host word
  const shuffledCorrectWords = shuffle(wordSet.realWords)
  const hostWord = shuffledCorrectWords[0]

  // select the correct word
  const correctWord = shuffledCorrectWords[1]

  // pick some decoy words
  const decoyWords = shuffle(wordSet.decoyWords).slice(0, 4)

  // shuffle in the correct word
  const wordsToShow = shuffle([...decoyWords, correctWord])

  // set this into the game
  game.words = {
    masterWord: hostWord,
    correctWord,
    choices: wordsToShow,
  }

  game.wordQueue = []

  return game
}

export const addPlayerAnswer = (
  gameID: string,
  playerID: string,
  answer: string
) => {
  const game = getGame(gameID)

  game.wordQueue.push({ id: playerID, word: answer })
  const player = game.players.find(player => player.id === playerID)!
  player.answeredThisRound = true
}

export const hasAllPlayersAnswered = (gameID: string) => {
  const game = getGame(gameID)

  return game.players.every(player => player.answeredThisRound)
}

export const scoreRound = (gameID: string) => {
  // Score the round
  // 5 points for first correct answer
  // -3 points for wrong answers or if the player timed out
  const game = getGame(gameID)

  let hadFirstWinner = false

  game.wordQueue.forEach(({ id: playerID, word }) => {
    const thisPlayer = game.players.find(player => player.id === playerID)!
    if (!hadFirstWinner && word === game.words?.correctWord) {
      thisPlayer.score += 5
    } else if (word !== game.words?.correctWord) {
      thisPlayer.score -= 3
    }
  })

  // punish all players who didn't answer
  game.players.forEach(player => {
    if (!player.answeredThisRound) {
      player.score -= 3
    }
  })

  game.roundNumber++

  return game
}
