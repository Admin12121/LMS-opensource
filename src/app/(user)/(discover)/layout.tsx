import { Navbar } from "./_components/navbar"

type ExploreLayoutProps = {
  children: React.ReactNode
}

const DiscoverLayout = ({ children }: ExploreLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-black w-full h-full">
      <Navbar />
      {children}
    </div>
  )
}

export default DiscoverLayout
