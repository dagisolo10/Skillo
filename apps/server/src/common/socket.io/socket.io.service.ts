import { ServerToClientEvents, TypedServer } from "@/types/socket.io-type.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SocketIoService {
    private server: TypedServer;

    setServer(server: TypedServer): void {
        this.server = server;
    }

    emit<Event extends keyof ServerToClientEvents>(event: Event, ...args: Parameters<ServerToClientEvents[Event]>): void {
        this.server.emit(event, ...args);
    }

    emitTo<Event extends keyof ServerToClientEvents>(event: Event, to: string, ...args: Parameters<ServerToClientEvents[Event]>): void {
        this.server.to(to).emit(event, ...args);
    }

    emitToMany<Event extends keyof ServerToClientEvents>(event: Event, receivers: string[], ...args: Parameters<ServerToClientEvents[Event]>): void {
        if (receivers.length === 0) return;
        this.server.to(receivers).emit(event, ...args);
    }
}
