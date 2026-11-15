import SessionDetailContent from "./session-detail";

export const instant = false;

export default async function SessionDetailPage({ params }: PageProps<"/sessions/[id]">) {
    const { id } = await params;

    return <SessionDetailContent id={id} />;
}
