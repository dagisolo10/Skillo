import { PartialType } from "@nestjs/mapped-types";
import { Skill, SkillCategory } from "@prisma/client";
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateSkillDto {
    @IsString()
    @MinLength(3, { message: "Name must be at least 3 characters" })
    @MaxLength(80, { message: "Name cannot exceed 80 characters" })
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(8, { message: "Emoji cannot exceed 8 characters" })
    emoji: string | undefined;

    @IsString()
    @MinLength(10, { message: "Description must be at least 10 characters" })
    @MaxLength(500, { message: "Description cannot exceed 500 characters" })
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
