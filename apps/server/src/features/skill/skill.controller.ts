import { Public } from "@/common/auth/public.decorator.js";
import { PaginatedResult, parsePageParams } from "@/common/pagination.js";
import { CreateSkillDto, SkillDetail, type SkillFilter, UpdateSkillDto } from "@/features/skill/dto/skill.dto.js";
import { SkillService } from "@/features/skill/skill.service.js";
import { SuccessResponse } from "@/types/responses.js";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";

@Controller("skill")
export class SkillController {
    constructor(private readonly skillService: SkillService) {}

    @Public()
    @Get()
    getSkills(
        @Query("page") page?: string,
        @Query("name") name?: string,
        @Query("limit") limit?: string,
        @Query("userId") userId?: string,
        @Query("category") category?: SkillFilter,
    ): Promise<PaginatedResult<SkillDetail>> {
        return this.skillService.getSkills(parsePageParams(page, limit), name, category, userId);
    }

    @Public()
    @Get(":id")
    getSkill(@Param("id") id: string): Promise<SkillDetail> {
        return this.skillService.getSkill(id);
    }

    @Post()
    createSkill(@Body() createSkillDto: CreateSkillDto): Promise<SkillDetail> {
        return this.skillService.createSkill(createSkillDto);
    }

    @Patch(":id")
    updateSkill(@Param("id") id: string, @Body() updateSkillDto: UpdateSkillDto): Promise<SkillDetail> {
        return this.skillService.updateSkill(id, updateSkillDto);
    }

    @Delete(":id")
    deleteSkill(@Param("id") id: string): Promise<SuccessResponse> {
        return this.skillService.deleteSkill(id);
    }
}
