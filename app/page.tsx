'use client'
import Navbar from '@/components/Navbar'
import Hero from '@/sections/Hero'
import AboutUs from '@/sections/AboutUs'
import Snowfall from 'react-snowfall'

const page = () => {
  return (
    <>
    <Snowfall
      color='pink'
          style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            pointerEvents: 'none', // IMPORTANT
          }}
          snowflakeCount={100}
        />
    <main className="px-8 py-8 w-full margin-auto">
      <Navbar />
      <Hero />
      <AboutUs />
    </main>
    </>
  )
}

export default page