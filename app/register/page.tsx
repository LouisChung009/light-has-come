'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function Register() {
    const [formData, setFormData] = useState({
        parentName: '',
        phone: '',
        email: '',
        childNickname: '',
        childAge: '',
        classType: '',
        contactTime: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // 自動判斷班級
    useEffect(() => {
        if (formData.childAge) {
            const age = parseInt(formData.childAge);
            let suggestedClass = '';
            if (age >= 2 && age <= 6) suggestedClass = '幼幼班';
            else if (age >= 7 && age <= 9) suggestedClass = '撒母耳班';
            else if (age >= 10 && age <= 12) suggestedClass = '約書亞班';

            if (suggestedClass) {
                setFormData(prev => ({ ...prev, classType: suggestedClass }));
            }
        }
    }, [formData.childAge]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        // 簡單驗證
        if (!formData.parentName || !formData.phone || !formData.childNickname || !formData.childAge) {
            setErrorMsg('請填寫所有必填欄位');
            setIsSubmitting(false);
            return;
        }

        try {
            const supabase = createClient();

            const { error } = await supabase
                .from('registrations')
                .insert({
                    parent_name: formData.parentName,
                    phone: formData.phone,
                    email: formData.email,
                    child_nickname: formData.childNickname,
                    child_age: parseInt(formData.childAge),
                    class_type: formData.classType,
                    contact_time: formData.contactTime,
                    message: formData.message,
                    status: 'pending'
                });

            if (error) throw error;

            setIsSuccess(true);
            setFormData({
                parentName: '',
                phone: '',
                email: '',
                childNickname: '',
                childAge: '',
                classType: '',
                contactTime: '',
                message: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMsg('報名失敗，請稍後再試，或直接來電聯繫。');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
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

                <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
                    <div style={{ background: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem' }}>報名成功！</h2>
                        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.125rem' }}>
                            我們已經收到您的預約資訊。<br />
                            將會有專人與您聯繫確認詳細時間。
                        </p>
                        <Link href="/" style={{
                            display: 'inline-block',
                            background: '#4A90C8',
                            color: 'white',
                            padding: '0.75rem 2rem',
                            borderRadius: '9999px',
                            textDecoration: 'none',
                            fontWeight: 600
                        }}>
                            回首頁
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <footer style={{ background: '#333', color: 'white', padding: '3rem 1.5rem', marginTop: 'auto' }}>
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

            {/* Form Section */}
            <section style={{ padding: '4rem 1.5rem' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '1rem' }}>預約體驗</h1>
                        <p style={{ fontSize: '1.125rem', color: '#666' }}>
                            歡迎來到「光·來了」！請填寫以下表格，我們將為您的孩子安排最適合的體驗課程。
                        </p>
                    </div>

                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        {errorMsg && (
                            <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Parent Name */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                                    家長姓名 <span style={{ color: '#FFAAA5' }}>*</span>
                                </label>
                                <input
                                    type="text" name="parentName" required placeholder="請輸入您的姓名"
                                    value={formData.parentName} onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #eee', borderRadius: '0.5rem', fontSize: '1rem' }}
                                />
                            </div>

                            {/* Phone */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                                    聯絡電話 <span style={{ color: '#FFAAA5' }}>*</span>
                                </label>
                                <input
                                    type="tel" name="phone" required placeholder="09xx-xxx-xxx"
                                    value={formData.phone} onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #eee', borderRadius: '0.5rem', fontSize: '1rem' }}
                                />
                            </div>

                            {/* Email */}
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

                            {/* Child Nickname */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                                    孩子暱稱 <span style={{ color: '#FFAAA5' }}>*</span>
                                </label>
                                <input
                                    type="text" name="childNickname" required placeholder="不需要真實姓名"
                                    value={formData.childNickname} onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #eee', borderRadius: '0.5rem', fontSize: '1rem' }}
                                />
                            </div>

                            {/* Child Age */}
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

                            {/* Class Type (Read only or auto-selected) */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                                    建議班級
                                </label>
                                <input
                                    type="text" name="classType" readOnly
                                    value={formData.classType || '選擇年齡後自動顯示'}
                                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #eee', borderRadius: '0.5rem', fontSize: '1rem', background: '#f9f9f9', color: '#666' }}
                                />
                            </div>

                            {/* Contact Time */}
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

                            {/* Message */}
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

                            {/* Privacy Notice */}
                            <div style={{ background: '#FFF8E7', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', borderLeft: '4px solid #FFD93D' }}>
                                <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>個資保護說明:</p>
                                <ul style={{ paddingLeft: '1.5rem', margin: 0, color: '#666', fontSize: '0.875rem' }}>
                                    <li>我們只收集必要資訊</li>
                                    <li>資料僅用於課程安排與聯絡</li>
                                </ul>
                            </div>

                            <button type="submit" disabled={isSubmitting} style={{
                                width: '100%', padding: '1rem', background: isSubmitting ? '#ccc' : '#4A90C8', color: 'white',
                                border: 'none', borderRadius: '0.5rem', fontSize: '1.125rem', fontWeight: 600,
                                cursor: isSubmitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(74, 144, 200, 0.3)'
                            }}>
                                {isSubmitting ? '提交中...' : '送出預約'}
                            </button>
                        </form>
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
