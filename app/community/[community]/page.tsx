import DomainTeam from "@/components/DomainTeam"
import Navbar from "@/components/Navbar"
import { domains } from "@/lib/customobjects"
// Mock data for domains - replace with your actual data source

const Page = async ({ params }: { params: Promise<{ community: string }> }) => {
  const { community } = await params;
  const currentDomain = domains.find((domain) => domain.url === community)

  if (!currentDomain) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <h1 className="text-2xl font-bold">Domain not found</h1>
      </div>
    )
  }

  return (
    <main className="px-8 py-8 w-full margin-auto min-h-screen">
        <Navbar />
        <div className="container mx-auto mt-12">
          <DomainTeam 
            wingName={currentDomain.title} 
            leads={currentDomain.leads} 
            cordinators={currentDomain.cordinators} 
          />
        </div>
    </main>
  )
}

export default Page
