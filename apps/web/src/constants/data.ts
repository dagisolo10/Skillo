import { SkillCategory, SkillCategoryFilter } from "@/types/models";

export const SKILL_CATEGORIES: SkillCategory[] = ["Tech", "Music", "Design", "Languages", "Wellness", "Crafts", "Other"];

export const CATEGORIES: SkillCategoryFilter[] = ["All", ...SKILL_CATEGORIES];
