import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    username: string;

    @IsOptional()
    @IsString()
    avatarSeed: string;

    @IsOptional()
    @IsString()
    @MaxLength(280, { message: "Bio cannot exceed 280 characters" })
    bio: string | null;
}
