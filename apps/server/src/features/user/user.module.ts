import { UserController } from "@/features/user/user.controller.js";
import { UserService } from "@/features/user/user.service.js";
import { Module } from "@nestjs/common";

@Module({
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
