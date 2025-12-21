import DomainTeam from "@/components/DomainTeam"
import { domains } from "@/lib/customobjects"
// Mock data for domains - replace with your actual data source

const Page = async ({ params }: { params: Promise<{ community: string }> }) => {
  const { community } = await params;
  const currentDomain = domains.find((domain) => domain.id === +community)

  if (!currentDomain) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <h1 className="text-2xl font-bold">Domain not found</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white pt-24">
        <DomainTeam 
          wingName={currentDomain.title} 
          leads={currentDomain.leads} 
          cordinators={currentDomain.cordinators} 
        />
    </div>
  )
}

export default Page
