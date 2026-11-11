import { SkillController } from "@/features/skill/skill.controller.js";
import { SkillService } from "@/features/skill/skill.service.js";
import { Module } from "@nestjs/common";

@Module({
    providers: [SkillService],
    controllers: [SkillController],
})
export class SkillModule {}
