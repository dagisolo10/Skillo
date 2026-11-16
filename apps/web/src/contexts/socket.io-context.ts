"use client";

import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

export interface ClientToServerEvents {
    "chat:go": () => void;
}
export interface ServerToClientEvents {
    "chat:go": () => void;
}

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

type SocketIoContextType = {
    connected: boolean;
    socket: TypedSocket | null;
    emit: <Event extends keyof ClientToServerEvents>(event: Event, ...args: Parameters<ClientToServerEvents[Event]>) => void;
};

export const SocketIoContext = createContext<SocketIoContextType>({
    socket: null,
    emit: () => {},
    connected: false,
});

export function useSocket() {
    const ctx = useContext(SocketIoContext);

    if (!ctx) throw new Error("Wrap the layout with SocketIoProvider");

    return ctx;
}
