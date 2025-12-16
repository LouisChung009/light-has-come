'use client'

import { bulkImportAlbums, type BulkImportResult } from '../actions'
import Link from 'next/link'
import { useState, useTransition, type FormEvent } from 'react'

export default function BulkImportPage() {
    const [result, setResult] = useState<BulkImportResult | null>(null)
    const [isPending, startTransition] = useTransition()
    const [selectedFileName, setSelectedFileName] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        setErrorMsg('')
        startTransition(async () => {
            try {
                const response = await bulkImportAlbums(formData)
                if (!response) {
                    setErrorMsg('匯入失敗，請稍後再試')
                    return
                }
                setResult(response)
                if (!response.success && response.errors.length === 0) {
                    setErrorMsg('匯入失敗，請檢查檔案是否正確或檔案過大')
                }
            } catch (err) {
                console.error('bulk import error', err)
                setErrorMsg('匯入時發生錯誤，請稍後再試')
            }
        })
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/admin/gallery" style={{ textDecoration: 'none', color: '#666' }}>
                    ← 返回相簿列表
                </Link>
                <h1 style={{ fontSize: '1.75rem', color: '#333', margin: 0 }}>批次匯入相簿</h1>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 0.9fr',
                gap: '1.5rem',
                alignItems: 'start'
            }}>
                <form onSubmit={handleSubmit} style={{ background: 'white', padding: '1.75rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', color: '#111' }}>上傳 ZIP 檔案</h2>
                        <p style={{ margin: 0, color: '#555', lineHeight: 1.6 }}>
                            以「資料夾=相簿」的方式壓縮。例如 <code>2024-05-12_母親節_craft/照片1.jpg</code>。
                            可一次匯入多個資料夾，相簿會自動建立並上傳照片。
                        </p>
                    </div>

                    <label style={{
                        display: 'block',
                        border: '2px dashed #d5e3f5',
                        padding: '1.25rem',
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        background: '#f8fbff',
                        color: '#1f3a5f'
                    }}>
                        <input
                            name="zipFile"
                            type="file"
                            accept=".zip"
                            required
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                setSelectedFileName(file ? file.name : '')
                            }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '1.75rem' }}>🗂️</span>
                            <div>
                                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                                    {selectedFileName || '選擇 ZIP 檔案'}
                                </div>
                                <div style={{ color: '#4a5568', fontSize: '0.9rem' }}>支援多資料夾，同步建立相簿與照片</div>
                            </div>
                        </div>
                    </label>

                    <button
                        type="submit"
                        disabled={isPending}
                        style={{
                            marginTop: '1rem',
                            width: '100%',
                            padding: '0.9rem',
                            background: isPending ? '#a0aec0' : '#4A90C8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.6rem',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: isPending ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        {isPending ? '匯入中...' : '開始匯入'}
                    </button>

                    {result && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            background: result.success ? '#ecfdf3' : '#fef2f2',
                            color: result.success ? '#166534' : '#b91c1c'
                        }}>
                            <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{result.message}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', color: '#334155' }}>
                                <div>新增相簿：{result.createdAlbums} 個</div>
                                <div>新增照片：{result.createdPhotos} 張</div>
                                <div>跳過檔案：{result.skippedFiles} 個</div>
                            </div>
                            {result.errors.length > 0 && (
                                <div style={{ marginTop: '0.75rem', color: '#b91c1c', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    {result.errors.map((err, idx) => <div key={idx}>• {err}</div>)}
                                </div>
                            )}
                            {result.details.length > 0 && (
                                <div style={{ marginTop: '0.75rem', color: '#1f2937', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    {result.details.map((info, idx) => <div key={idx}>• {info}</div>)}
                                </div>
                            )}
                        </div>
                    )}
                </form>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                    <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.15rem', color: '#111' }}>準備方式</h3>
                    <ol style={{ margin: '0 0 1rem 1.25rem', color: '#444', lineHeight: 1.6, padding: 0 }}>
                        <li style={{ marginBottom: '0.4rem' }}>將 LINE 相簿匯出後，每個相簿放在各自資料夾。</li>
                        <li style={{ marginBottom: '0.4rem' }}>資料夾名稱可帶日期與分類，例如 <code>2024-12-25_聖誕節_special</code>。</li>
                        <li style={{ marginBottom: '0.4rem' }}>多個資料夾一起壓成一個 ZIP，上傳即可自動建立相簿與照片。</li>
                    </ol>

                    <div style={{
                        background: '#0f172a',
                        color: '#e2e8f0',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        fontFamily: 'ui-monospace, SFMono-Regular, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        fontSize: '0.9rem',
                        marginBottom: '1rem',
                        lineHeight: 1.5
                    }}>
                        範例結構：
                        <pre style={{ margin: '0.75rem 0 0', whiteSpace: 'pre-wrap' }}>
{`albums.zip
├─ 2024-05-12_母親節_craft/
│  ├─ photo1.jpg
│  └─ photo2.png
└─ 2024-12-25_聖誕節_special/
   ├─ IMG_001.jpg
   └─ IMG_002.jpg`}
                        </pre>
                    </div>

                    <div style={{
                        background: '#f8fafc',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid #e2e8f0',
                        color: '#1f2937',
                        lineHeight: 1.6
                    }}>
                        <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>進階：manifest.json（可選）</div>
                        <div style={{ fontSize: '0.95rem' }}>在 ZIP 根目錄放入 <code>manifest.json</code> 可覆寫標題/日期/分類：</div>
                        <pre style={{
                            margin: '0.75rem 0 0',
                            background: '#0f172a',
                            color: '#e2e8f0',
                            padding: '0.75rem',
                            borderRadius: '0.6rem',
                            fontSize: '0.85rem',
                            whiteSpace: 'pre-wrap'
                        }}>
{`{
  "albums": [
    {
      "folder": "2024-12-25_聖誕節_special",
      "title": "聖誕節慶祝",
      "date": "2024-12-25",
      "category": "special",
      "description": "自 LINE 匯入",
      "id": "custom-id-01"
    }
  ]
}`}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
}
