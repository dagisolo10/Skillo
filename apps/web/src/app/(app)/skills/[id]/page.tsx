import SkillDetailContent from "./skill-detail";

export const instant = false;

export default async function SkillDetailPage({ params }: PageProps<"/skills/[id]">) {
    const { id } = await params;

    return <SkillDetailContent id={id} />;
}
