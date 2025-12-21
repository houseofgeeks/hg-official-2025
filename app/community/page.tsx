"use client"
import Domains from '@/sections/Domains'
import Navbar from "@/components/Navbar"


const Community = () => {
  return (
    <main className="px-8 py-8 w-full margin-auto min-h-screen">
        <Navbar />
        <div className="container mx-auto mt-12">
        <Domains/>
    </div>
    </main>
  )
}

export default Community
