"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socketIO = __importStar(require("socket.io"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const shared_1 = require("shared");
const host_1 = __importDefault(require("./handlers/host"));
const client_1 = __importDefault(require("./handlers/client"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
}));
const server = http_1.default.createServer(app);
const io = new socketIO.Server(server, {
    cors: {
        origin: '*',
    },
});
io.on(shared_1.EVENTS.CLIENT.CONNECT, socket => {
    console.log(`Socket ${socket.id} connected`);
    if (socket.handshake.query.role) {
        socket.data.role = socket.handshake.query.role;
    }
    else {
        socket.data.role = 'client';
    }
    if (socket.data.role === 'host') {
        (0, host_1.default)(io, socket);
    }
    if (socket.data.role === 'client') {
        (0, client_1.default)(io, socket);
    }
});
const port = 3001;
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
