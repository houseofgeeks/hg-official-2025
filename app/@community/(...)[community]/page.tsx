import DomainTeam from "@/components/DomainTeam"
import { domains } from "@/lib/customobjects"
import ModalWrapper from "./ModalWrapper"

const Page = async ({ params }: { params: Promise<{ community: string }> }) => {
  const { community } = await params;
  // Match the same logic as the regular route - use url instead of id
  const currentDomain = domains.find((domain) => domain.url === community)

  if (!currentDomain) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-white">
        <h1 className="text-2xl font-bold">Domain not found</h1>
      </div>
    )
  }

  return (
    <ModalWrapper>
      <div className="p-6">
        <DomainTeam 
          wingName={currentDomain.title} 
          leads={currentDomain.leads} 
          cordinators={currentDomain.cordinators} 
        />
      </div>
    </ModalWrapper>
  )
}

export default Page