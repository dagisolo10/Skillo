import { Public } from "@/common/auth/public.decorator.js";
import { PaginatedResult, parsePageParams } from "@/common/pagination.js";
import { SkillDetail, type SkillFilter } from "@/features/skill/dto/skill.dto.js";
import { SkillService } from "@/features/skill/skill.service.js";
import { Controller, Get, Query } from "@nestjs/common";

@Controller("skill")
export class SkillController {
    constructor(private readonly skillService: SkillService) {}

    @Public()
    @Get()
    getSkills(@Query("page") page?: string, @Query("name") name?: string, @Query("limit") limit?: string, @Query("category") category?: SkillFilter): Promise<PaginatedResult<SkillDetail>> {
        return this.skillService.getSkills(parsePageParams(page, limit), name, category);
    }
}
