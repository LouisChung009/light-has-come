import { getDb, Registration } from '@/utils/db'
import { redirect } from 'next/navigation'
import RegistrationRow from './RegistrationRow'

export default async function Dashboard() {
    // Auth check handled by middleware

    const sql = getDb()
    const registrations = await sql`
        SELECT * FROM registrations 
        ORDER BY created_at DESC
    ` as Registration[]

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '2rem', color: '#333' }}>
                報名資料管理
            </h1>

            <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>報名時間</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>家長姓名</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>聯絡電話</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>孩子暱稱 (年齡)</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>班級</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>狀態</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                                        目前沒有報名資料
                                    </td>
                                </tr>
                            ) : (
                                registrations?.map((reg) => (
                                    <RegistrationRow key={reg.id} reg={reg} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
