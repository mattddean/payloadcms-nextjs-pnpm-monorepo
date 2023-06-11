import { type FC } from 'react'

export const runtime = 'nodejs'
export const revalidate = 0
export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Home',
  description: 'Home',
}

const Home: FC = () => {
  return <div>Hello</div>
}

export default Home
