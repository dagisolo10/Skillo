import { CreateSessionDto, SessionDetail } from "@/features/session/dto/session.dto.js";
import { SessionService } from "@/features/session/session.service.js";
import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";

@Controller("session")
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    @Post()
    createSession(@Body() createSessionDto: CreateSessionDto): Promise<SessionDetail> {
        return this.sessionService.createSession(createSessionDto);
    }

    @Get()
    getSessions(): Promise<SessionDetail[]> {
        return this.sessionService.getSessions();
    }

    @Get(":id")
    getSession(@Param("id") id: string): Promise<SessionDetail> {
        return this.sessionService.getSession(id);
    }

    @Patch(":id/accept")
    acceptSession(@Param("id") id: string): Promise<SessionDetail> {
        return this.sessionService.acceptOrRejectSession(id, "accept");
    }

    @Patch(":id/reject")
    rejectSession(@Param("id") id: string): Promise<SessionDetail> {
        return this.sessionService.acceptOrRejectSession(id, "reject");
    }
}
