import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { EVENTS } from 'shared'
import { addPlayerToGame } from '../game/game'

const clientHandler = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, null>,
  socket: Socket
) => {
  const onJoinGame = (gameID: string) => {
    const playerData = {
      id: socket.id,
      name: socket.data.name,
    }

    try {
      addPlayerToGame(gameID, playerData)
    } catch (error) {
      const e = error as Error
      console.log(e.message)
      socket.emit(EVENTS.SERVER.ERROR, e.message)
      return
    }

    socket.send(`Joined game ${gameID}`)
    socket.to(gameID).emit(EVENTS.SERVER.PLAYER_JOINED_ROOM, playerData)
    console.log(
      `Player ${socket.id} [${socket.data.name}] joined game ${gameID}`
    )
  }

  socket.on(EVENTS.CLIENT.JOIN_GAME, onJoinGame)
}

export default clientHandler
