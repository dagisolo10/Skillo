import localFont from "next/font/local";

export const plusJakartaSans = localFont({
    src: [
        { path: "../../public/fonts/Plus_Jakarta_Sans/PlusJakartaSans-Light.ttf", weight: "300", style: "normal" },
        { path: "../../public/fonts/Plus_Jakarta_Sans/PlusJakartaSans-Regular.ttf", weight: "400", style: "normal" },
        { path: "../../public/fonts/Plus_Jakarta_Sans/PlusJakartaSans-Medium.ttf", weight: "500", style: "normal" },
        { path: "../../public/fonts/Plus_Jakarta_Sans/PlusJakartaSans-SemiBold.ttf", weight: "600", style: "normal" },
        { path: "../../public/fonts/Plus_Jakarta_Sans/PlusJakartaSans-Bold.ttf", weight: "700", style: "normal" },
        { path: "../../public/fonts/Plus_Jakarta_Sans/PlusJakartaSans-ExtraBold.ttf", weight: "800", style: "normal" },
    ],
    variable: "--font-plus-jakarta",
});

export const clashDisplay = localFont({
    src: [
        { path: "../../public/fonts/ClashDisplay/ClashDisplay-Extralight.ttf", weight: "200", style: "normal" },
        { path: "../../public/fonts/ClashDisplay/ClashDisplay-Light.ttf", weight: "300", style: "normal" },
        { path: "../../public/fonts/ClashDisplay/ClashDisplay-Regular.ttf", weight: "400", style: "normal" },
        { path: "../../public/fonts/ClashDisplay/ClashDisplay-Medium.ttf", weight: "500", style: "normal" },
        { path: "../../public/fonts/ClashDisplay/ClashDisplay-Semibold.ttf", weight: "600", style: "normal" },
        { path: "../../public/fonts/ClashDisplay/ClashDisplay-Bold.ttf", weight: "700", style: "normal" },
    ],
    variable: "--font-clash-display",
});
