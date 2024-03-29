import { GameState, IGame } from '../types/game'
import { IPlayer } from '../types/players'
import shuffle from 'lodash/shuffle'

// These are used in the mock created for Game, so need to be hoisted
// TODO: Move all these bits into Fixtures
const realWords = ['a', 'b']
const decoyWords = ['1', '2', '3', '4', '5']

import * as Game from './game'

const makeTestGame = (): IGame => ({
  gameID: 'game',
  hostID: 'host',
  gameState: GameState.open,
  players: [],
  roundNumber: 0,
  wordQueue: [],
})

const mockGameGetter = (testGame: IGame) => {
  const spy = jest.spyOn(Game, 'getGameFromID')
  spy.mockImplementation(() => testGame)
  return spy
}

jest.mock('lodash/shuffle', () => jest.fn(input => input))

jest.mock('./words', () => [
  {
    realWords,
    decoyWords,
  },
])

describe('game', () => {
  let gameSetterMock: jest.SpyInstance

  beforeAll(() => {
    gameSetterMock = jest
      .spyOn(Game, 'setGameWithID')
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .mockImplementation(() => {})
    jest.clearAllMocks()
  })

  beforeEach(() => {
    gameSetterMock.mockClear()
  })

  test('createNewGame generates a game with appropriate settings', () => {
    const gameID = 'game',
      hostID = 'host'
    const newGame = Game.createNewGame(gameID, hostID)
    expect(gameSetterMock).toHaveBeenCalledWith(gameID, newGame)
    expect(newGame).toEqual<IGame>({
      gameID,
      hostID,
      gameState: GameState.open,
      players: [],
      roundNumber: 0,
      wordQueue: [],
    })
  })

  test('startGame resets game state and round number', () => {
    const testGame = makeTestGame()
    testGame.roundNumber = 123
    const spy = mockGameGetter(testGame)

    const returnedGame = Game.startGame('game')
    expect(returnedGame.roundNumber).toBe(0)
    expect(returnedGame.gameState).toBe(GameState.started)
    spy.mockRestore()
  })

  describe('addPlayerToGame', () => {
    test('throws an error if player added to already started game', () => {
      const testGame = makeTestGame()
      testGame.gameState = GameState.started
      const testPlayer: IPlayer = {
        id: 'player1',
        name: 'BOB',
      }
      const spy = mockGameGetter(testGame)

      expect(() => Game.addPlayerToGame('game', testPlayer)).toThrowError(
        'Game has already started'
      )

      spy.mockRestore()
    })

    test('throws an error if player is already added to game', () => {
      const testGame = makeTestGame()
      const testPlayer: IPlayer = {
        id: 'player1',
        name: 'BOB',
      }
      const spy = mockGameGetter(testGame)

      Game.addPlayerToGame('game', testPlayer)
      expect(() => Game.addPlayerToGame('game', testPlayer)).toThrowError(
        'Player player1 [BOB] is already in game'
      )

      spy.mockRestore()
    })

    test('adds the player to the game object', () => {
      const testGame = makeTestGame()
      const testPlayer: IPlayer = {
        id: 'player1',
        name: 'BOB',
      }
      const spy = mockGameGetter(testGame)

      Game.addPlayerToGame('game', testPlayer)

      expect(testGame.players).toEqual([
        {
          id: 'player1',
          name: 'BOB',
          score: 0,
          answeredThisRound: false,
        },
      ])

      spy.mockRestore()
    })

    test('called with different players adds each to the game object', () => {
      const testGame = makeTestGame()
      const testPlayer1: IPlayer = {
        id: 'player1',
        name: 'BOB',
      }
      const testPlayer2: IPlayer = {
        id: 'player2',
        name: 'Leland',
      }
      const spy = mockGameGetter(testGame)

      Game.addPlayerToGame('game', testPlayer1)

      expect(testGame.players).toEqual([
        {
          id: 'player1',
          name: 'BOB',
          score: 0,
          answeredThisRound: false,
        },
      ])

      Game.addPlayerToGame('game', testPlayer2)

      expect(testGame.players).toEqual([
        {
          id: 'player1',
          name: 'BOB',
          score: 0,
          answeredThisRound: false,
        },
        {
          id: 'player2',
          name: 'Leland',
          score: 0,
          answeredThisRound: false,
        },
      ])

      spy.mockRestore()
    })
  })

  describe('setupNewRound', () => {
    test('should pick appropriate words from WordList and shuffle themx', () => {
      // Note, not a great test since this makes huge assumptions about
      // the implementation going on
      const testGame = makeTestGame()
      testGame.gameState = GameState.started
      testGame.players = [
        {
          id: 'player1',
          name: 'BOB',
          score: 0,
          answeredThisRound: false,
        },
      ]
      const gameStoreSpy = mockGameGetter(testGame)
      const newGame = Game.setupNewRound('game')

      expect(shuffle).toBeCalledTimes(3)
      expect(newGame.words).toEqual({
        masterWord: realWords[0],
        correctWord: realWords[1],
        choices: [...decoyWords.slice(0, 4), realWords[1]],
      })
      expect(shuffle).toHaveBeenCalledWith(realWords)
      expect(shuffle).toHaveBeenCalledWith(decoyWords)
      expect(shuffle).toHaveBeenCalledWith([
        ...decoyWords.slice(0, 4),
        realWords[1],
      ])

      gameStoreSpy.mockRestore()
    })
  })

  describe('addPlayerAnswer', () => {
    test('should add the players answer to the game', () => {
      const playerID = 'player1'
      const testGame = makeTestGame()
      testGame.gameState = GameState.started
      testGame.players = [
        {
          id: playerID,
          name: 'BOB',
          score: 0,
          answeredThisRound: false,
        },
      ]

      const gameStoreSpy = mockGameGetter(testGame)
      Game.setupNewRound('game')
      expect(testGame.wordQueue).toEqual([])
      Game.addPlayerAnswer(testGame.gameID, playerID, decoyWords[0])

      expect(testGame.players[0].answeredThisRound).toBeTruthy()
      expect(testGame.wordQueue).toEqual([
        { id: playerID, word: decoyWords[0] },
      ])
      gameStoreSpy.mockRestore()
    })

    test("should throw an error if the player isn't in the game", () => {
      const playerID = 'player2'
      const testGame = makeTestGame()
      testGame.gameState = GameState.started
      testGame.players = [
        {
          id: 'player1',
          name: 'BOB',
          score: 0,
          answeredThisRound: false,
        },
      ]

      const gameStoreSpy = mockGameGetter(testGame)
      Game.setupNewRound('game')
      expect(() =>
        Game.addPlayerAnswer(testGame.gameID, playerID, decoyWords[0])
      ).toThrowError(`Player ${playerID} not in game`)
      gameStoreSpy.mockRestore()
    })

    test('should throw an error if the player has already answered', () => {
      const playerID = 'player1'
      const testGame = makeTestGame()
      testGame.gameState = GameState.started
      testGame.players = [
        {
          id: playerID,
          name: 'BOB',
          score: 0,
          answeredThisRound: false,
        },
      ]

      const gameStoreSpy = mockGameGetter(testGame)
      Game.setupNewRound('game')

      Game.addPlayerAnswer(testGame.gameID, playerID, decoyWords[0])

      expect(() =>
        Game.addPlayerAnswer(testGame.gameID, playerID, decoyWords[0])
      ).toThrowError(`Player ${playerID} has already answered`)
      gameStoreSpy.mockRestore()
    })

    test('should throw an error if the player is giving a different answer to the choices', () => {
      const playerID = 'player1'
      const testGame = makeTestGame()
      testGame.gameState = GameState.started
      testGame.players = [
        {
          id: playerID,
          name: 'BOB',
          score: 0,
          answeredThisRound: false,
        },
      ]

      const gameStoreSpy = mockGameGetter(testGame)
      Game.setupNewRound('game')

      expect(() =>
        Game.addPlayerAnswer(testGame.gameID, playerID, 'notingame')
      ).toThrowError(`Player ${playerID}'s answer isn't in the choices`)
      gameStoreSpy.mockRestore()
    })
  })

  describe('scoreRound', () => {
    test('gives 5 points for the first correct answer', () => {
      const testGame = makeTestGame()
      testGame.gameState = GameState.started
      testGame.players = [
        {
          id: 'player1',
          name: 'BOB',
          score: 0,
          answeredThisRound: false,
        },
        {
          id: 'player2',
          name: 'Leland',
          score: 0,
          answeredThisRound: false,
        },
      ]
      testGame.words = {
        masterWord: 'a',
        correctWord: 'b',
        choices: ['1', '2', '3', '4', 'b'],
      }
      const spy = mockGameGetter(testGame)

      Game.addPlayerAnswer(testGame.gameID, 'player1', 'b')
      Game.addPlayerAnswer(testGame.gameID, 'player2', 'b')

      Game.scoreRound(testGame.gameID)
      expect(testGame.players[0].score).toBe(5)
      expect(testGame.players[1].score).toBe(0)
      spy.mockRestore()
    })

    test('deducts 3 points for each incorrect answer', () => {
      const testGame = makeTestGame()
      testGame.gameState = GameState.started
      testGame.players = [
        {
          id: 'player1',
          name: 'BOB',
          score: 0,
          answeredThisRound: false,
        },
        {
          id: 'player2',
          name: 'Leland',
          score: 0,
          answeredThisRound: false,
        },
      ]
      testGame.words = {
        masterWord: 'a',
        correctWord: 'b',
        choices: ['1', '2', '3', '4', 'b'],
      }
      const spy = mockGameGetter(testGame)

      Game.addPlayerAnswer(testGame.gameID, 'player1', '1')
      Game.addPlayerAnswer(testGame.gameID, 'player2', '2')

      Game.scoreRound(testGame.gameID)
      expect(testGame.players[0].score).toBe(-3)
      expect(testGame.players[1].score).toBe(-3)
      spy.mockRestore()
    })

    test('deducts 3 points for not answering in time', () => {
      const testGame = makeTestGame()
      testGame.gameState = GameState.started
      testGame.players = [
        {
          id: 'player1',
          name: 'BOB',
          score: 0,
          answeredThisRound: false,
        },
      ]
      testGame.words = {
        masterWord: 'a',
        correctWord: 'b',
        choices: ['1', '2', '3', '4', 'b'],
      }
      const spy = mockGameGetter(testGame)

      Game.scoreRound(testGame.gameID)
      expect(testGame.players[0].score).toBe(-3)
      spy.mockRestore()
    })

    test('increments round number', () => {
      const testGame = makeTestGame()
      testGame.gameState = GameState.started
      const spy = mockGameGetter(testGame)

      expect(testGame.roundNumber).toBe(0)
      Game.scoreRound(testGame.gameID)
      expect(testGame.roundNumber).toBe(1)
      spy.mockRestore()
    })

    test('should output the winner', () => {
      const testGame = makeTestGame()
      testGame.gameState = GameState.started
      testGame.players = [
        {
          id: 'player1',
          name: 'BOB',
          score: 0,
          answeredThisRound: false,
        },
        {
          id: 'player2',
          name: 'Leland',
          score: 0,
          answeredThisRound: false,
        },
      ]
      testGame.words = {
        masterWord: 'a',
        correctWord: 'b',
        choices: ['1', '2', '3', '4', 'b'],
      }
      const spy = mockGameGetter(testGame)

      Game.addPlayerAnswer(testGame.gameID, 'player1', 'b')
      Game.addPlayerAnswer(testGame.gameID, 'player2', 'b')

      const { winner } = Game.scoreRound(testGame.gameID)
      expect(winner).toBe(testGame.players[0])
      spy.mockRestore()
    })

    test('should output the list of losers', () => {
      const testGame = makeTestGame()
      testGame.gameState = GameState.started
      testGame.players = [
        {
          id: 'player1',
          name: 'BOB',
          score: 0,
          answeredThisRound: false,
        },
        {
          id: 'player2',
          name: 'Leland',
          score: 0,
          answeredThisRound: false,
        },
      ]
      testGame.words = {
        masterWord: 'a',
        correctWord: 'b',
        choices: ['1', '2', '3', '4', 'b'],
      }
      const spy = mockGameGetter(testGame)

      Game.addPlayerAnswer(testGame.gameID, 'player1', '1')
      Game.addPlayerAnswer(testGame.gameID, 'player2', '2')

      const { losers } = Game.scoreRound(testGame.gameID)
      expect(losers).toStrictEqual([testGame.players[0], testGame.players[1]])
      spy.mockRestore()
    })

    test('should output the people who time out', () => {
      const testGame = makeTestGame()
      testGame.gameState = GameState.started
      testGame.players = [
        {
          id: 'player1',
          name: 'BOB',
          score: 0,
          answeredThisRound: false,
        },
        {
          id: 'player2',
          name: 'Leland',
          score: 0,
          answeredThisRound: false,
        },
      ]
      testGame.words = {
        masterWord: 'a',
        correctWord: 'b',
        choices: ['1', '2', '3', '4', 'b'],
      }
      const spy = mockGameGetter(testGame)

      Game.addPlayerAnswer(testGame.gameID, 'player2', '2')

      const { timeOuters } = Game.scoreRound(testGame.gameID)
      expect(timeOuters).toStrictEqual([testGame.players[0]])
      spy.mockRestore()
    })

    test('should output if the game is over', () => {
      const testGame = makeTestGame()
      testGame.gameState = GameState.started
      testGame.players = [
        {
          id: 'player1',
          name: 'BOB',
          score: 0,
          answeredThisRound: false,
        },
        {
          id: 'player2',
          name: 'Leland',
          score: 0,
          answeredThisRound: false,
        },
      ]
      testGame.words = {
        masterWord: 'a',
        correctWord: 'b',
        choices: ['1', '2', '3', '4', 'b'],
      }
      const spy = mockGameGetter(testGame)

      let results = Game.scoreRound(testGame.gameID)
      expect(results.isGameOver).toBeFalsy()

      testGame.roundNumber = 4
      results = Game.scoreRound(testGame.gameID)
      expect(results.isGameOver).toBeTruthy()

      spy.mockRestore()
    })
  })
})
