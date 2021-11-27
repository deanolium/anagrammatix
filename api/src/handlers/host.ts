import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { EVENTS } from 'shared'
import { customAlphabet } from 'nanoid'
import { lowercase } from 'nanoid-dictionary'
import { createNewGame, startGame } from '../game/game'

const generateID = customAlphabet(lowercase, 5)

// A map to keep track of which game is associated with a host
// This allows us to then know the game ID whenever a host talks to us
const hostGames: Map<string, string> = new Map()

// A handler to deal with messages from the host
const hostHandler = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, null>,
  socket: Socket
) => {
  const onCreateGame = () => {
    // Lets first make a room id, making sure it doesn't exist
    // then join that room, and emit what the game code is
    // We should also make the game object...
    let gameID

    // Create a unique game ID
    do {
      gameID = generateID()
    } while (io.sockets.adapter.rooms.has(gameID))

    socket.join(gameID)
    console.log(`Game created with id ${gameID}`)

    hostGames.set(socket.id, gameID)
    const newGame = createNewGame(gameID, socket.id)

    socket.emit(EVENTS.SERVER.GAME_CREATED, { newGame })
  }

  const onStartGame = () => {
    // Deal with the host starting the game
    const gameID = hostGames.get(socket.id)
    if (!gameID) {
      socket.emit(EVENTS.SERVER.ERROR, 'You need to create a game first')
      return
    }

    const game = startGame(gameID)

    // Tell everyone that the game is about to begin
    // The host will then wait a few seconds before starting the first round
    // creating anticipation...
    io.to(gameID).emit(EVENTS.SERVER.BEGIN_NEW_GAME, game)
  }

  socket.on(EVENTS.CLIENT.CREATE_GAME, onCreateGame)
  socket.on(EVENTS.CLIENT.START_GAME, onStartGame)
  socket.on(EVENTS.CLIENT.START_FIRST_ROUND, () => {})
  socket.on(EVENTS.CLIENT.START_NEXT_ROUND, () => {})
}

export default hostHandler
