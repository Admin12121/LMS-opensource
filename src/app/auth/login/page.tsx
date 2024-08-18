import dynamic from 'next/dynamic';
const Login = dynamic(() => import('@/components/auth/login'), { ssr: false })

const Page = () => {
  return (
    <Login/>
  )
}

export default Page;