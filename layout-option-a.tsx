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
                {/* 方案 A: 雙字體組合 */}
                <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Sans+TC:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
            </head>
            <body style={{
                fontFamily: "'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}>
                <style jsx global>{`
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Ma Shan Zheng', 'Noto Sans TC', cursive !important;
          }
        `}</style>
                {children}
            </body>
        </html>
    );
}
