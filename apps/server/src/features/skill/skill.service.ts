import { PageParams, paginate, PaginatedResult } from "@/common/pagination.js";
import { PrismaService } from "@/common/prisma/prisma.service.js";
import { SkillDetail, SkillFilter } from "@/features/skill/dto/skill.dto.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SkillService {
    constructor(private readonly prisma: PrismaService) {}

    async getSkills(
        pageParam: PageParams,
        name?: string,
        category?: SkillFilter,
    ): Promise<PaginatedResult<SkillDetail>> {
        const skills = await paginate(pageParam, async ({ take, skip }) => {
            return await this.prisma.skill.findMany({
                take,
                skip,
                where: {
                    ...(category !== "All" && { category }),
                    ...(name && { name: { contains: name, mode: "insensitive" } }),
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            username: true,
                            avatarSeed: true,
                        },
                    },
                },
            });
        });

        return skills;
    }
}
