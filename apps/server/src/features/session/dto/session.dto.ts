import { Session } from "@prisma/client";
import { IsString, IsUUID } from "class-validator";

export class CreateSessionDto {
    @IsString()
    @IsUUID()
    skillId: string;
}

export type SessionUser = {
    id: string;
    name: string;
    username: string;
    avatarSeed: string;
};

export type SessionDetail = Session & {
    skill: {
        id: string;
        name: string;
        emoji: string | null;
        category: string;
    };
    mentor: SessionUser;
    learner: SessionUser;
};
