'use client'

import { updateRegistrationStatus, deleteRegistration } from './actions'
import { useState } from 'react'

import { Registration } from '@/utils/db'

export default function RegistrationRow({ reg }: { reg: Registration }) {
    const [isUpdating, setIsUpdating] = useState(false)

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true)
        await updateRegistrationStatus(reg.id, newStatus)
        setIsUpdating(false)
    }

    const handleDelete = async () => {
        if (confirm('確定要刪除這筆報名資料嗎？')) {
            setIsUpdating(true)
            await deleteRegistration(reg.id)
            setIsUpdating(false)
        }
    }

    return (
        <tr style={{ borderBottom: '1px solid #f1f5f9', opacity: isUpdating ? 0.5 : 1 }}>
            <td style={{ padding: '1rem', color: '#334155' }}>
                {new Date(reg.created_at).toLocaleDateString()}
            </td>
            <td style={{ padding: '1rem', fontWeight: 500, color: '#0f172a' }}>
                {reg.parent_name}
                {reg.message && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', maxWidth: '200px' }}>
                        備註: {reg.message}
                    </div>
                )}
            </td>
            <td style={{ padding: '1rem', color: '#334155' }}>{reg.phone}</td>
            <td style={{ padding: '1rem', color: '#334155' }}>
                {reg.child_nickname} ({reg.child_age}歲)
            </td>
            <td style={{ padding: '1rem' }}>
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: reg.class_type === '幼幼班' ? '#FEF3C7' :
                        reg.class_type === '撒母耳班' ? '#E0F2FE' : '#FEE2E2',
                    color: reg.class_type === '幼幼班' ? '#D97706' :
                        reg.class_type === '撒母耳班' ? '#0284C7' : '#DC2626'
                }}>
                    {reg.class_type}
                </span>
            </td>
            <td style={{ padding: '1rem' }}>
                <select
                    value={reg.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={isUpdating}
                    style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        background: reg.status === 'pending' ? '#F1F5F9' : '#DCFCE7',
                        color: reg.status === 'pending' ? '#64748b' : '#16A34A',
                        cursor: 'pointer'
                    }}
                >
                    <option value="pending">待處理</option>
                    <option value="contacted">已聯絡</option>
                    <option value="confirmed">已確認</option>
                </select>
            </td>
            <td style={{ padding: '1rem' }}>
                <button
                    onClick={handleDelete}
                    disabled={isUpdating}
                    style={{
                        color: '#ef4444',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }}
                >
                    刪除
                </button>
            </td>
        </tr>
    )
}
