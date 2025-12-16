'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { submitRegistration } from './actions'

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        parentName: '',
        phone: '',
        email: '',
        childNickname: '',
        childAge: '',
        classType: '',
        contactTime: '',
        message: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    // 自動判斷班級
    useEffect(() => {
        if (formData.childAge) {
            const age = parseInt(formData.childAge)
            let suggestedClass = ''
            if (age >= 2 && age <= 6) suggestedClass = '幼幼班'
            else if (age >= 7 && age <= 9) suggestedClass = '撒母耳班'
            else if (age >= 10 && age <= 12) suggestedClass = '約書亞班'

            if (suggestedClass) {
                setFormData(prev => ({ ...prev, classType: suggestedClass }))
            }
        }
    }, [formData.childAge])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrorMsg('')

        if (!formData.parentName || !formData.phone || !formData.childNickname || !formData.childAge) {
            setErrorMsg('請填寫所有必填欄位')
            setIsSubmitting(false)
            return
        }

        try {
            const result = await submitRegistration({
                parentName: formData.parentName,
                phone: formData.phone,
                email: formData.email,
                childNickname: formData.childNickname,
                childAge: parseInt(formData.childAge),
                classType: formData.classType,
                contactTime: formData.contactTime,
                message: formData.message
            });

            if (result.error) {
                throw new Error(result.error)
            }

            setIsSuccess(true)
            setFormData({
                parentName: '',
                phone: '',
                email: '',
                childNickname: '',
                childAge: '',
                classType: '',
                contactTime: '',
                message: ''
            })
        } catch (error: any) {
            console.error('Error submitting form:', error)
            setErrorMsg(error.message || '報名失敗，請稍後再試，或直接來電聯繫。')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div style={{ flex: 1, background: '#F5F5F5' }}>
                <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
                    <div style={{ background: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
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
            </div>
        )
    }

    return (
        <div style={{ flex: 1, background: '#F5F5F5' }}>
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
                                    孩子暱稱 <span style={{ color: '#FFAAA5' }}>*</span>
                                </label>
                                <input
                                    type="text" name="childNickname" required placeholder="不需要真實姓名"
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
                                    建議班級
                                </label>
                                <input
                                    type="text" name="classType" readOnly
                                    value={formData.classType || '選擇年齡後自動顯示'}
                                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #eee', borderRadius: '0.5rem', fontSize: '1rem', background: '#f9f9f9', color: '#666' }}
                                />
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
        </div>
    )
}
