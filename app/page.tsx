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
      <section id="about" className="py-24 w-full">
        <AboutUs />
      </section>
      <Domains useModal={true} />
    </main>
    </>
  )
}

export default page