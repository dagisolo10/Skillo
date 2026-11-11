import { PartialType } from "@nestjs/mapped-types";
import { Skill, SkillCategory } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateSkillDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    emoji: string | undefined;

    @IsString()
    description: string;

    @IsEnum(SkillCategory)
    @IsString()
    category: SkillCategory;
}

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}

export type SkillFilter = SkillCategory | "All";
export type SkillDetail = Skill & {
    user: {
        name: string;
        username: string;
        avatarSeed: string;
    };
};
