"use client"
import Domains from '@/sections/Domains'
import Navbar from "@/components/Navbar"
import CommunityLead from '@/components/CommunityLead'


const Community = () => {
  return (
    <main className="px-8 py-8 w-full margin-auto min-h-screen">
        <Navbar />
        <div className="container mx-auto mt-12">
          <CommunityLead/>
        <Domains useModal={false} />
    </div>
    </main>
  )
}

export default Community
