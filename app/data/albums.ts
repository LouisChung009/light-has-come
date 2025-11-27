export interface Photo {
    id: string;
    src: string;
    width: number;
    height: number;
    alt: string;
}

export interface Album {
    id: string;
    title: string;
    date: string;
    description: string;
    coverColor: string;
    category: 'craft' | 'music' | 'science' | 'outdoor' | 'special';
    photos: Photo[];
}

// 產生隨機高度的照片以模擬瀑布流效果
const generatePhotos = (count: number, category: string): Photo[] => {
    return Array.from({ length: count }).map((_, i) => {
        // 隨機長寬比: 1:1, 3:4, 4:3
        const aspectRatios = [1, 0.75, 1.33];
        const ratio = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
        const width = 400;
        const height = Math.floor(width / ratio);

        return {
            id: `${category}-${i + 1}`,
            src: `https://placehold.co/${width}x${height}?text=${category}+${i + 1}`,
            width,
            height,
            alt: `${category} photo ${i + 1}`
        };
    });
};

export const albums: Album[] = [
    {
        id: 'craft-2024-01',
        title: '創意手作時間',
        date: '2024.01.15',
        description: '孩子們專注地製作手工藝品，發揮無限創意。',
        coverColor: 'linear-gradient(135deg, #FFD93D, #FFAAA5)',
        category: 'craft',
        photos: generatePhotos(12, 'Craft')
    },
    {
        id: 'music-2024-02',
        title: '音樂律動課',
        date: '2024.02.20',
        description: '在音樂中快樂學習，肢體律動與歌唱讚美。',
        coverColor: 'linear-gradient(135deg, #4A90C8, #B4E7CE)',
        category: 'music',
        photos: generatePhotos(10, 'Music')
    },
    {
        id: 'science-2024-03',
        title: '科學實驗探索',
        date: '2024.03.10',
        description: '動手做實驗，探索上帝創造的科學奧秘。',
        coverColor: 'linear-gradient(135deg, #2E5C8A, #4A90C8)',
        category: 'science',
        photos: generatePhotos(8, 'Science')
    },
    {
        id: 'outdoor-2024-04',
        title: '戶外教學',
        date: '2024.04.05',
        description: '走出教室，在大自然中學習與成長。',
        coverColor: 'linear-gradient(135deg, #B4E7CE, #FFD93D)',
        category: 'outdoor',
        photos: generatePhotos(15, 'Outdoor')
    },
    {
        id: 'special-christmas',
        title: '聖誕節慶祝',
        date: '2023.12.25',
        description: '歡樂的節日慶祝活動，分享愛與祝福。',
        coverColor: 'linear-gradient(135deg, #FFAAA5, #FFD93D)',
        category: 'special',
        photos: generatePhotos(20, 'Christmas')
    },
    {
        id: 'craft-mother-day',
        title: '母親節卡片製作',
        date: '2024.05.12',
        description: '用愛心製作給媽媽的禮物，表達感恩之情。',
        coverColor: 'linear-gradient(135deg, #FFD93D, #B4E7CE)',
        category: 'craft',
        photos: generatePhotos(10, 'MotherDay')
    },
    {
        id: 'music-worship',
        title: '詩歌敬拜時間',
        date: '2024.06.01',
        description: '孩子們用純真的歌聲讚美上帝。',
        coverColor: 'linear-gradient(135deg, #4A90C8, #FFAAA5)',
        category: 'music',
        photos: generatePhotos(8, 'Worship')
    },
    {
        id: 'special-easter',
        title: '復活節彩蛋活動',
        date: '2024.03.31',
        description: '尋找彩蛋，分享復活節的喜樂與盼望。',
        coverColor: 'linear-gradient(135deg, #B4E7CE, #4A90C8)',
        category: 'special',
        photos: generatePhotos(12, 'Easter')
    },
];
