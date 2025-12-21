'use client'
import Navbar from '@/components/Navbar'
import Hero from '@/sections/Hero'
import AboutUs from '@/sections/AboutUs'
import Domains from '@/sections/Domains'
import ParticlesContainer from '@/components/ParticlesContainer'
const page = () => {
  return (
    <>
    <ParticlesContainer />
    <main className="px-8 py-8 w-full margin-auto">
      <Navbar />
      <Hero />
      <AboutUs />
      <Domains useModal={true} />
    </main>
    </>
  )
}

export default page