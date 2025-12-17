import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { GET as healthGET } from '../app/api/health/route'
import { GET as debugGET } from '../app/api/debug-db/route'

async function run() {
  const db = process.env.DATABASE_URL
  if (!db) {
    console.error('Please set DATABASE_URL env before running this test')
    process.exit(2)
  }

  console.log('Calling health GET (light)')
  try {
    const req = new Request('http://localhost/api/health')
    const res: any = await (healthGET as any)(req)
    try {
      const json = await res.json()
      console.log('health response:', json)
    } catch (e) {
      console.log('health response not JSON', e)
    }
  } catch (e: any) {
    console.error('health handler threw:', e.stack || e.message || e)
  }

  console.log('\nCalling debug GET (estimates)')
  try {
    const req = new Request('http://localhost/api/debug-db')
    const res: any = await (debugGET as any)(req)
    try {
      const json = await res.json()
      console.log('debug response:', json)
    } catch (e) {
      console.log('debug response not JSON', e)
    }
  } catch (e: any) {
    console.error('debug handler threw:', e.stack || e.message || e)
  }
}

run().catch(e=>{console.error('ERR', e); process.exit(1)})
