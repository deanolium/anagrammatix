import * as socketIO from 'socket.io'
import http from 'http'
import express from 'express'
import cors from 'cors'
import { EVENTS } from 'shared'
import hostHandler from './handlers/host'
import clientHandler from './handlers/client'

const app = express()
app.use(
  cors({
    origin: '*',
  })
)

const server = http.createServer(app)
const io = new socketIO.Server(server, {
  cors: {
    origin: '*',
  },
})

io.on(EVENTS.CLIENT.CONNECT, socket => {
  console.log(`Socket ${socket.id} connected`)
  if (socket.handshake.query.role) {
    socket.data.role = socket.handshake.query.role
  } else {
    socket.data.role = 'client'
  }

  if (socket.data.role === 'host') {
    hostHandler(io, socket)
  }

  if (socket.data.role === 'client') {
    clientHandler(io, socket)
  }
})

const port = 3001
server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
