import { ClientToServerEvents, ServerToClientEvents } from "@skillo/socket-events";
import { User } from "@supabase/supabase-js";
import { DefaultEventsMap, Server, Socket } from "socket.io";

export type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, { user: User }>;
export type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, { user: User }>;
