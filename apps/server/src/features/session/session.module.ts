import { SessionController } from "@/features/session/session.controller.js";
import { SessionService } from "@/features/session/session.service.js";
import { Module } from "@nestjs/common";

@Module({
    providers: [SessionService],
    controllers: [SessionController],
})
export class SessionModule {}
