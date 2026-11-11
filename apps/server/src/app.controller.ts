import { Public } from "@/common/auth/public.decorator.js";
import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
    @Public()
    @Get()
    getHello(): { timestamp: string; message: string } {
        return {
            timestamp: new Date().toLocaleString(),
            message: "🟢 Nest API Working",
        };
    }
}
