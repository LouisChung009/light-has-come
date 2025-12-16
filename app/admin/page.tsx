import { login } from './actions'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string }
}) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F5F5F5'
        }}>
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '0.5rem',
                    fontSize: '1.5rem',
                    color: '#333'
                }}>
                    後台管理系統
                </h1>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#999', marginBottom: '1.5rem' }}>
                    System v1.1 (Neon Auth)
                </p>

                <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>密碼</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            background: '#4A90C8',
                            color: 'white',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                    >
                        登入
                    </button>

                    {searchParams?.message && (
                        <p style={{
                            color: '#ef4444',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            marginTop: '0.5rem'
                        }}>
                            {searchParams.message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}
