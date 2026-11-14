import { CreateSessionDto, SessionDetail } from "@/features/session/dto/session.dto.js";
import { SessionService } from "@/features/session/session.service.js";
import { Body, Controller, Get, Post } from "@nestjs/common";

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
}
