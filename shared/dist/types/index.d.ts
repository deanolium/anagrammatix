import { Action, PayloadAction } from '@reduxjs/toolkit';
export interface IListener {
    message: string;
    action: (...args: any[]) => PayloadAction | Action;
}
export interface ISocketConfig {
    apiURL: string;
    role?: string;
    listeners: IListener[];
    subscribers: string[];
}
