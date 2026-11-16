"use client";

import { ClientToServerEvents, ServerToClientEvents } from "@skillo/socket-events";
import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

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
