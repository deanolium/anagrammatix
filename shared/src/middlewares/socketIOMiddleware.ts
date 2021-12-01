import { io } from 'socket.io-client'
import { Middleware } from '@reduxjs/toolkit'
import { ISocketConfig } from '../types'

const socketIOMiddleware: (config: ISocketConfig) => Middleware = config => {
  const socket = io(config.apiURL, {
    query: {
      ...(config.role && { role: config.role }),
    },
  })

  let listenersAreMapped = false

  return store => next => action => {
    if (!listenersAreMapped) {
      // map the listeners
      config.listeners.forEach(listener => {
        socket.on(listener.message, data => {
          store.dispatch(listener.action(data))
        })
      })
      listenersAreMapped = true
    }

    if (config.subscribers.includes(action.type)) {
      socket.emit(action.type, action.payload)
    }

    next(action)
  }
}

export default socketIOMiddleware
