import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "光·來了 | 大里思恩堂兒童主日學",
    description: "讓孩子在愛中成長，玩出喜樂、美善的品格。大里思恩堂兒童主日學，透過聖經故事、音樂律動、手作創意，培養孩子的品格與技能。",
    keywords: "兒童主日學, 大里思恩堂, 光來了, 品格教育, 兒童課程, 台中大里",
};
// Version: 2024-11-27 - Font updated to Huninn

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-TW">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* Huninn (粉圓體) - Google Fonts 版本 */}
                <link href="https://fonts.googleapis.com/css2?family=Huninn:wght@400;700&display=swap" rel="stylesheet" />
                {/* Noto Sans TC 作為備用字體 */}
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet" />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
