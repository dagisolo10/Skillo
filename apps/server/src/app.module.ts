import { AppController } from "@/app.controller.js";
import { AuthGuard } from "@/common/auth/auth.guard.js";
import { PrismaModule } from "@/common/prisma/prisma.module.js";
import { RequestModule } from "@/common/request/request.module.js";
import { SocketIoModule } from "@/common/socket.io/socket.io.module.js";
import { SupabaseModule } from "@/common/supabase/supabase.module.js";
import { UserModule } from "@/features/user/user.module.js";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";

@Module({
    controllers: [AppController],
    providers: [{ useClass: AuthGuard, provide: APP_GUARD }],
    imports: [ConfigModule.forRoot({ isGlobal: true }), RequestModule, PrismaModule, SupabaseModule, SocketIoModule, UserModule],
})
export class AppModule {}
