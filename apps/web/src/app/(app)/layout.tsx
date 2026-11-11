import Navbar from "@/components/navbar";

export default function AppLayout({ children }: LayoutProps<"/">) {
    return (
        <div className="relative h-full">
            <Navbar />
            <div className="mt-28">{children}</div>
        </div>
    );
}
