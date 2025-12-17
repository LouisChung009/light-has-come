import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import bcrypt from 'bcryptjs';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error('Error: DATABASE_URL not found in .env.local');
    process.exit(1);
}

const sql = neon(databaseUrl);

async function main() {
    console.log('Starting migration to Neon...');

    try {
        // 1. Create Base Tables (Registrations, Albums, Photos) - Cleaned from schema.sql
        // Removed storage policies and Supabase specific RLS that might fail
        console.log('Creating base tables...');
        await sql`
            CREATE TABLE IF NOT EXISTS registrations (
                id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
                created_at timestamp with time zone NOT NULL DEFAULT now(),
                parent_name text NOT NULL,
                phone text NOT NULL,
                email text,
                child_nickname text NOT NULL,
                child_age smallint NOT NULL,
                class_type text NOT NULL,
                contact_time text,
                message text,
                status text NOT NULL DEFAULT 'pending'
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS albums (
                id text NOT NULL PRIMARY KEY,
                created_at timestamp with time zone NOT NULL DEFAULT now(),
                title text NOT NULL,
                date date NOT NULL,
                description text,
                cover_color text DEFAULT 'linear-gradient(135deg, #FFD93D, #FFAAA5)',
                category text NOT NULL
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS photos (
                id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
                created_at timestamp with time zone NOT NULL DEFAULT now(),
                album_id text NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
                src text NOT NULL,
                width integer NOT NULL DEFAULT 800,
                height integer NOT NULL DEFAULT 600,
                alt text
            );
        `;

        // 2. Create CMS Tables (SiteContent, BannerSlides) - From comprehensive_cms.sql
        console.log('Creating CMS tables...');
        await sql`DROP TABLE IF EXISTS site_content CASCADE`;
        await sql`DROP TABLE IF EXISTS banner_slides CASCADE`;

        await sql`
            CREATE TABLE site_content (
                id text NOT NULL PRIMARY KEY,
                category text NOT NULL,
                section text,
                label text NOT NULL,
                content text NOT NULL,
                content_type text NOT NULL DEFAULT 'text',
                display_order integer DEFAULT 0,
                updated_at timestamp with time zone DEFAULT now()
            );
        `;

        await sql`
            CREATE TABLE banner_slides (
                id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
                title text,
                subtitle text,
                media_url text NOT NULL,
                media_type text NOT NULL,
                link_url text,
                display_order integer NOT NULL DEFAULT 0,
                is_active boolean NOT NULL DEFAULT true,
                created_at timestamp with time zone DEFAULT now(),
                updated_at timestamp with time zone DEFAULT now()
            );
        `;

        // 3. Create Admin Users Table (Custom Auth replacement)
        console.log('Creating admin_users table...');
        await sql`
            CREATE TABLE IF NOT EXISTS admin_users (
                id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                email text NOT NULL UNIQUE,
                name text,
                password_hash text NOT NULL,
                created_at timestamp with time zone DEFAULT now()
            );
        `;

        // 4. Seed Initial Data
        console.log('Seeding initial data...');

        // Seed Site Content
        const siteContentValues = [
            ['home_hero_title', 'home', 'hero', '首頁主標題', '讓孩子在愛中成長', 'text', 1],
            ['home_hero_subtitle', 'home', 'hero', '首頁副標題', '大里思恩堂兒童主日學歡迎您', 'text', 2],
            ['home_hero_description', 'home', 'hero', '首頁描述', '我們相信每個孩子都是上帝的寶貝，在「光·來了」，孩子們將透過聖經故事、品格教育、創意活動，認識耶穌的愛，建立美好的品格與價值觀。', 'text', 3],
            ['home_hero_cta', 'home', 'hero', 'CTA 按鈕文字', '立即預約體驗', 'text', 4],
            ['home_values_title', 'home', 'values', '價值主張標題', '為什麼選擇「光·來了」？', 'text', 1],
            ['home_value_1_title', 'home', 'values', '價值1標題', '聖經為本', 'text', 2],
            ['home_value_1_desc', 'home', 'values', '價值1說明', '以聖經真理為基礎，幫助孩子建立正確的價值觀', 'text', 3],
            ['home_value_2_title', 'home', 'values', '價值2標題', '品格培育', 'text', 4],
            ['home_value_2_desc', 'home', 'values', '價值2說明', '透過故事與活動，培養孩子的好品格', 'text', 5],
            ['home_value_3_title', 'home', 'values', '價值3標題', '快樂學習', 'text', 6],
            ['home_value_3_desc', 'home', 'values', '價值3說明', '在遊戲中學習，讓信仰教育充滿樂趣', 'text', 7],
            ['home_courses_title', 'home', 'courses', '課程預覽標題', '我們的課程', 'text', 1],
            ['home_courses_subtitle', 'home', 'courses', '課程預覽副標題', '根據年齡分班，給孩子最適合的成長環境', 'text', 2],
            ['courses_intro_title', 'courses', 'intro', '課程介紹標題', '課程介紹', 'text', 1],
            ['courses_intro_desc', 'courses', 'intro', '課程介紹說明', '我們根據孩子的年齡與發展階段，設計了三個不同的班級，每個班級都有專屬的課程內容與活動設計。', 'text', 2],
            ['courses_toddler_name', 'courses', 'toddler', '幼幼班名稱', '幼幼班', 'text', 1],
            ['courses_toddler_age', 'courses', 'toddler', '幼幼班年齡', '2-6歲', 'text', 2],
            ['courses_toddler_desc', 'courses', 'toddler', '幼幼班說明', '透過遊戲、唱歌、手作等活動，讓孩子在快樂中認識耶穌的愛。', 'text', 3],
            ['courses_samuel_name', 'courses', 'samuel', '撒母耳班名稱', '撒母耳班', 'text', 1],
            ['courses_samuel_age', 'courses', 'samuel', '撒母耳班年齡', '7-9歲', 'text', 2],
            ['courses_samuel_desc', 'courses', 'samuel', '撒母耳班說明', '深入淺出的聖經故事教學，培養孩子的信仰根基與品格。', 'text', 3],
            ['courses_joshua_name', 'courses', 'joshua', '約書亞班名稱', '約書亞班', 'text', 1],
            ['courses_joshua_age', 'courses', 'joshua', '約書亞班年齡', '10-12歲', 'text', 2],
            ['courses_joshua_desc', 'courses', 'joshua', '約書亞班說明', '引導孩子思考信仰與生活的連結，建立個人與神的關係。', 'text', 3],
            ['about_title', 'about', 'intro', '關於我們標題', '關於我們', 'text', 1],
            ['about_intro', 'about', 'intro', '關於我們簡介', '「光·來了」是大里思恩堂的兒童主日學，我們致力於為孩子提供一個充滿愛與歡樂的學習環境。', 'text', 2],
            ['about_vision_title', 'about', 'vision', '願景標題', '我們的願景', 'text', 1],
            ['about_vision', 'about', 'vision', '願景說明', '成為孩子生命中的光，陪伴他們在信仰中成長，在愛中茁壯。', 'text', 2],
            ['about_mission_title', 'about', 'mission', '使命標題', '我們的使命', 'text', 1],
            ['about_mission', 'about', 'mission', '使命說明', '透過聖經教導、品格培育、創意活動，幫助孩子認識神、愛神、服事神。', 'text', 2],
            ['contact_address', 'contact', 'info', '地址', '412台灣大里區東榮路312號', 'text', 1],
            ['contact_phone', 'contact', 'info', '電話', '04 2482 3735', 'text', 2],
            ['contact_time', 'contact', 'info', '聚會時間', '每週日 10:00-11:30', 'text', 3]
        ];

        // Batch insert helper manually constructing query? 
        // @neondatabase/serverless template strings are good for security but batching dynamic list is tricky.
        // We will loop for simplicity in this seed script.
        for (const row of siteContentValues) {
            await sql`
                INSERT INTO site_content (id, category, section, label, content, content_type, display_order)
                VALUES (${row[0]}, ${row[1]}, ${row[2]}, ${row[3]}, ${row[4]}, ${row[5]}, ${row[6]})
                ON CONFLICT (id) DO UPDATE SET
                content = EXCLUDED.content,
                label = EXCLUDED.label,
                section = EXCLUDED.section,
                category = EXCLUDED.category,
                content_type = EXCLUDED.content_type,
                display_order = EXCLUDED.display_order
             `;
        }

        // Seed Admin User
        const adminEmail = 'admin@example.com';
        const defaultPassword = 'password';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        await sql`
            INSERT INTO admin_users (email, name, password_hash)
            VALUES (${adminEmail}, 'Admin', ${hashedPassword})
            ON CONFLICT (email) DO NOTHING
        `;

        console.log(`Migration Complete!`);
        console.log(`Default admin user: ${adminEmail} / ${defaultPassword}`);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

main();
