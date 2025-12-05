import Footer from '../components/Footer'
import RegisterForm from './RegisterForm'

export const dynamic = 'force-dynamic'

export default function RegisterPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#F5F5F5', display: 'flex', flexDirection: 'column' }}>
            <RegisterForm />
            <Footer />
        </div>
    )
}
