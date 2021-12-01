import { Middleware } from '@reduxjs/toolkit';
import { ISocketConfig } from '../types';
declare const socketIOMiddleware: (config: ISocketConfig) => Middleware;
export default socketIOMiddleware;
