"use client";

import { useAuth } from "@/contexts/auth-context";
import { ClientToServerEvents, SocketIoContext, TypedSocket } from "@/contexts/socket.io-context";
import { SERVER_URL } from "@/lib/api/axios";
import { Dispatch, PropsWithChildren, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function SocketIoProvider({ children }: PropsWithChildren) {
    const { token, isSignedIn } = useAuth();
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState<TypedSocket | null>(null);

    const setSocketRef = useRef<Dispatch<SetStateAction<TypedSocket | null>>>(null);
    useEffect(() => {
        setSocketRef.current = setSocket;
    }, []);

    useEffect(() => {
        if (!token || !isSignedIn) {
            setSocketRef.current?.(null);
            return;
        }

        const socketInstance = io(SERVER_URL, {
            auth: { token },
            autoConnect: true,
            reconnection: true,
            withCredentials: true,
        }) as TypedSocket;

        socketInstance.on("connect", () => {
            setConnected(true);
            console.log("✅ Socket Connected!");
        });

        socketInstance.on("disconnect", (reason) => {
            setConnected(false);
            console.log("❌ Socket Disconnected!", reason);
        });

        socketInstance.on("connect_error", (error) => {
            setConnected(false);
            console.warn("Socket connection attempt failed:", error.message);
        });

        setSocketRef.current?.(socketInstance);

        return () => {
            socketInstance.off("connect");
            socketInstance.off("disconnect");
            socketInstance.off("connect_error");
            socketInstance.disconnect();
            setSocketRef.current?.((currentSocket) => (currentSocket === socketInstance ? null : currentSocket));
            setConnected(false);
            console.log("🧹 Disconnecting previous socket instance...");
        };
    }, [isSignedIn, token]);

    const emit = useCallback(
        <Event extends keyof ClientToServerEvents>(event: Event, ...args: Parameters<ClientToServerEvents[Event]>) => {
            if (!socket || !socket.connected) return;

            socket.emit(event, ...args);
        },
        [socket],
    );

    return (
        <SocketIoContext.Provider
            value={{
                emit,
                socket,
                connected,
            }}
        >
            {children}
        </SocketIoContext.Provider>
    );
}
