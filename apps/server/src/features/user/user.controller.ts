import { Public } from "@/common/auth/public.decorator.js";
import { UpdateUserDto } from "@/features/user/dto/update-user.dto.js";
import { UserService } from "@/features/user/user.service.js";
import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getMe() {
        return this.userService.getMe();
    }

    @Public()
    @Get("username/:username")
    isUsernameAvailable(@Param("username") username: string) {
        return this.userService.isUsernameAvailable(username);
    }

    @Patch()
    updateProfile(@Body() updateUserDto: UpdateUserDto) {
        return this.userService.updateProfile(updateUserDto);
    }

    @Delete()
    deleteProfile() {
        return this.userService.deleteProfile();
    }
}
