import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { EVENTS } from 'shared'
import {
  addPlayerAnswer,
  addPlayerToGame,
  hasAllPlayersAnswered,
  scoreRound,
} from '../game/game'

const clientHandler = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, null>,
  socket: Socket
) => {
  const onJoinGame = ({ gameID, name }: { gameID: string; name: string }) => {
    socket.data.name = name
    const playerData = {
      id: socket.id,
      name,
    }

    try {
      addPlayerToGame(gameID, playerData)
    } catch (error) {
      const e = error as Error
      console.log(e.message)
      socket.emit(EVENTS.SERVER.ERROR, e.message)
      return
    }

    socket.join(gameID)
    socket.send(`Joined game ${gameID}`)
    socket.to(gameID).emit(EVENTS.SERVER.PLAYER_JOINED_ROOM, playerData)
    console.log(
      `Player ${socket.id} [${socket.data.name}] joined game ${gameID}`
    )
  }

  const onPlayerAnswer = ({
    gameID,
    answer,
  }: {
    gameID: string
    answer: string
  }) => {
    try {
      addPlayerAnswer(gameID, socket.id, answer)

      socket.send(`Answer received`)
      console.log(
        `Player ${socket.id} [${socket.data.name}] provided an answer`
      )

      if (hasAllPlayersAnswered(gameID)) {
        const results = scoreRound(gameID)

        if (results.isGameOver) {
          // game is over - so sort out the winners and all that
          io.to(gameID).emit(EVENTS.SERVER.GAME_OVER, results)
          return
        }

        // send across the winners/losers
        io.to(gameID).emit(EVENTS.SERVER.END_OF_ROUND, results)
      }
    } catch (error) {
      const e = error as Error
      console.log(e.message)
      socket.emit(EVENTS.SERVER.ERROR, e.message)
      return
    }
  }

  socket.on(EVENTS.CLIENT.JOIN_GAME, onJoinGame)
  socket.on(EVENTS.CLIENT.PLAYER_ANSWER, onPlayerAnswer)
}

export default clientHandler
