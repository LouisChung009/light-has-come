'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Register() {
    const [formData, setFormData] = useState({
        parentName: '',
        phone: '',
        email: '',
        childNickname: '',
        childAge: '',
        preferredClass: '',
        contactTime: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);

    // Auto-select class based on age
    useEffect(() => {
        const age = parseInt(formData.childAge);
        if (age >= 2 && age <= 6) {
            setFormData(prev => ({ ...prev, preferredClass: '幼幼班' }));
        } else if (age >= 7 && age <= 9) {
            setFormData(prev => ({ ...prev, preferredClass: '撒母耳班' }));
        } else if (age >= 10 && age <= 12) {
            setFormData(prev => ({ ...prev, preferredClass: '約書亞班' }));
        }
    }, [formData.childAge]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate
        if (!formData.parentName || !formData.phone || !formData.childAge) {
            alert('請填寫所有必填欄位');
            return;
        }

        // Store in localStorage
        const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
        registrations.push({ ...formData, timestamp: new Date().toISOString() });
        localStorage.setItem('registrations', JSON.stringify(registrations));

        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
            {/* Header */}
            <header style={{ background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h1 style={{ fontSize: '1.5rem', color: '#333', margin: 0 }}>光·來了</h1>
                            <span style={{ fontSize: '0.875rem', color: '#666' }}>大里思恩堂兒童主日學</span>
                        </div>
                    </Link>
                    <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <Link href="/" style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>首頁</Link>
                        <Link href="/courses" style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>課程介紹</Link>
                        <Link href="/gallery" style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>活動花絮</Link>
                        <Link href="/about" style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>關於我們</Link>
                        <Link href="/register" style={{
                            background: '#4A90C8',
                            color: 'white',
                            padding: '0.5rem 1.25rem',
                            borderRadius: '9999px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                        }}>預約體驗</Link>
                    </nav>
                </div>
            </header>

            {/* Page Header */}
            <section style={{
                background: 'linear-gradient(135deg, #4A90C8, #B4E7CE)',
                color: 'white',
                padding: '4rem 1.5rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '1rem' }}>預約免費體驗</h1>
                    <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', opacity: 0.9 }}>歡迎帶孩子來體驗「光·來了」的課程</p>
                </div>
            </section>

            {/* Register Section */}
            <section style={{ padding: '4rem 1.5rem' }}>
                <div className="container" style={{ maxWidth: '1200px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>

                    {/* Info Side */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', height: 'fit-content' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#333' }}>為什麼選擇「光·來了」?</h2>
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                            {[
                                { icon: '✨', title: '完全免費', desc: '所有課程、教材、點心都免費提供' },
                                { icon: '👥', title: '小班制教學', desc: '每班10-15人,2-3位老師' },
                                { icon: '🎨', title: '多元體驗', desc: '手作、音樂、科學、戶外活動' },
                                { icon: '❤️', title: '品格培養', desc: '在遊戲中學習美善的品格' }
                            ].map((item, i) => (
                                <li key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.25rem', color: '#333' }}>{item.title}</h4>
                                        <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div style={{
                            background: 'linear-gradient(135deg, #4A90C8, #2E5C8A)',
                            color: 'white',
                            padding: '1.5rem',
                            borderRadius: '0.5rem'
                        }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>聯絡資訊</h3>
                            <p style={{ marginBottom: '0.5rem', opacity: 0.9 }}>📍 412台灣大里區東榮路312號</p>
                            <p style={{ marginBottom: '0.5rem', opacity: 0.9 }}>📞 04 2482 3735</p>
                            <p style={{ opacity: 0.9 }}>⏰ 每週日 10:00-11:30</p>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                                <div style={{
                                    width: '80px', height: '80px', background: '#4A90C8', color: 'white',
                                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '3rem', margin: '0 auto 1.5rem'
                                }}>✓</div>
                                <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#333' }}>預約成功!</h3>
                                <p style={{ color: '#666', marginBottom: '0.5rem' }}>感謝您的預約,我們會盡快與您聯絡確認體驗時間。</p>
                                <p style={{ color: '#666', marginBottom: '2rem' }}>期待在「光·來了」見到您和孩子! 💡</p>
                                <Link href="/" style={{
                                    display: 'inline-block', padding: '0.75rem 2rem', border: '2px solid #4A90C8',
                                    color: '#4A90C8', borderRadius: '9999px', textDecoration: 'none', fontWeight: 600
                                }}>返回首頁</Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#333' }}>填寫預約資訊</h3>
                                <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.875rem' }}>我們會盡快與您聯絡確認體驗時間</p>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                                        家長姓名或稱呼 <span style={{ color: '#FFAAA5' }}>*</span>
                                    </label>
                                    <input
                                        type="text" name="parentName" required placeholder="請輸入您的稱呼"
                                        value={formData.parentName} onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #eee', borderRadius: '0.5rem', fontSize: '1rem' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                                        聯絡電話 <span style={{ color: '#FFAAA5' }}>*</span>
                                    </label>
                                    <input
                                        type="tel" name="phone" required placeholder="0912-345-678"
                                        value={formData.phone} onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #eee', borderRadius: '0.5rem', fontSize: '1rem' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                                        Email (選填)
                                    </label>
                                    <input
                                        type="email" name="email" placeholder="your@email.com"
                                        value={formData.email} onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #eee', borderRadius: '0.5rem', fontSize: '1rem' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                                        孩子暱稱 (選填)
                                    </label>
                                    <input
                                        type="text" name="childNickname" placeholder="不需要真實姓名"
                                        value={formData.childNickname} onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #eee', borderRadius: '0.5rem', fontSize: '1rem' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                                        孩子年齡 <span style={{ color: '#FFAAA5' }}>*</span>
                                    </label>
                                    <select
                                        name="childAge" required
                                        value={formData.childAge} onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #eee', borderRadius: '0.5rem', fontSize: '1rem', background: 'white' }}
                                    >
                                        <option value="">請選擇年齡</option>
                                        {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(age => (
                                            <option key={age} value={age}>{age}歲</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                                        希望體驗的班級 (選填)
                                    </label>
                                    <select
                                        name="preferredClass"
                                        value={formData.preferredClass} onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #eee', borderRadius: '0.5rem', fontSize: '1rem', background: 'white' }}
                                    >
                                        <option value="">系統會根據年齡自動分配</option>
                                        <option value="幼幼班">幼幼班 (2-6歲)</option>
                                        <option value="撒母耳班">撒母耳班 (7-9歲)</option>
                                        <option value="約書亞班">約書亞班 (10-12歲)</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                                        方便聯絡時間 (選填)
                                    </label>
                                    <input
                                        type="text" name="contactTime" placeholder="例如: 平日晚上、週末下午"
                                        value={formData.contactTime} onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #eee', borderRadius: '0.5rem', fontSize: '1rem' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                                        其他問題或需求 (選填)
                                    </label>
                                    <textarea
                                        name="message" rows={4} placeholder="有任何想了解的都可以告訴我們"
                                        value={formData.message} onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #eee', borderRadius: '0.5rem', fontSize: '1rem', resize: 'vertical' }}
                                    ></textarea>
                                </div>

                                <div style={{ background: '#FFF8E7', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', borderLeft: '4px solid #FFD93D' }}>
                                    <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>個資保護說明:</p>
                                    <ul style={{ paddingLeft: '1.5rem', margin: 0, color: '#666', fontSize: '0.875rem' }}>
                                        <li>我們只收集必要資訊</li>
                                        <li>資料僅用於課程安排與聯絡</li>
                                    </ul>
                                </div>

                                <button type="submit" style={{
                                    width: '100%', padding: '1rem', background: '#4A90C8', color: 'white',
                                    border: 'none', borderRadius: '0.5rem', fontSize: '1.125rem', fontWeight: 600,
                                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(74, 144, 200, 0.3)'
                                }}>
                                    送出預約
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: '#333', color: 'white', padding: '3rem 1.5rem' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem',
                        marginBottom: '2rem',
                    }}>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', color: '#FFD93D', marginBottom: '1rem' }}>光·來了</h3>
                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
                                大里思恩堂兒童主日學<br />
                                "我就是來到世上的光,使凡信我的不住在黑暗裡。"
                            </p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>聯絡資訊</h4>
                            <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 2 }}>
                                <p>📍 412台灣大里區東榮路312號</p>
                                <p>📞 04 2482 3735</p>
                                <p>⏰ 每週日 10:00-11:30</p>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>快速連結</h4>
                            <div style={{ lineHeight: 2 }}>
                                <p><Link href="/courses" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>課程介紹</Link></p>
                                <p><Link href="/gallery" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>活動花絮</Link></p>
                                <p><Link href="/about" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>關於我們</Link></p>
                                <p><Link href="/register" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>預約體驗</Link></p>
                            </div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                        <p>© 2025 光·來了 - 大里思恩堂兒童主日學. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
