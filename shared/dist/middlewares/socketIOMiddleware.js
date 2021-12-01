"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const socketIOMiddleware = config => {
    const socket = (0, socket_io_client_1.io)(config.apiURL, {
        query: {
            ...(config.role && { role: config.role }),
        },
    });
    let listenersAreMapped = false;
    return store => next => action => {
        if (!listenersAreMapped) {
            // map the listeners
            config.listeners.forEach(listener => {
                socket.on(listener.message, data => {
                    store.dispatch(listener.action(data));
                });
            });
            listenersAreMapped = true;
        }
        if (config.subscribers.includes(action.type)) {
            socket.emit(action.type, action.payload);
        }
        next(action);
    };
};
exports.default = socketIOMiddleware;
