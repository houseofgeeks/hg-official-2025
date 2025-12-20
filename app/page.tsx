'use client'
import Navbar from '@/components/Navbar'
import Snowfall from 'react-snowfall'
// import Hero from '@/components/Hero'
const page = () => {
  return (
    <>
    <Snowfall
  // Changes the snowflake color
  color="gray"
  // Controls the number of snowflakes that are created (default 150)
  snowflakeCount={100}
/>
    <main className="px-8 py-8 w-full margin-auto">
      <Navbar />
      {/* <Hero /> */}
    </main>
    </>
  )
}

export default page