/* eslint-disable @next/next/no-head-element, @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "光·來了 | 大里思恩堂兒童主日學",
    description: "讓孩子在愛中成長，玩出喜樂、美善的品格。大里思恩堂兒童主日學，透過聖經故事、音樂律動、手作創意，培養孩子的品格與技能。",
    keywords: "兒童主日學, 大里思恩堂, 光來了, 品格教育, 兒童課程, 台中大里",
};

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
                {/* 方案 B: 全站 ZCOOL XiaoWei */}
                <link href="https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap" rel="stylesheet" />
            </head>
            <body style={{
                fontFamily: "'ZCOOL XiaoWei', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}>
                {children}
            </body>
        </html>
    );
}
/* eslint-disable @next/next/no-head-element, @next/next/no-page-custom-font */
