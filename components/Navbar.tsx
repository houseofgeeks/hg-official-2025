'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { RxHamburgerMenu, RxCross1 } from 'react-icons/rx';

const Navbar = () => {
  const [isopen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const toggleMenu = () => {
    setIsOpen(!isopen)
  }

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = typeof document !== 'undefined' ? document.getElementById(id) : null
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      if (typeof window !== 'undefined') window.history.pushState(null, '', `/#${id}`)
    } else {
      router.push(`/#${id}`)
    }
    setIsOpen(false)
  }

  return (
      <nav className="flex margin-x-auto text-white items-center text-3xl font-teko justify-between md:mr-20 mr-0 py-4 px-4 md:px-8">
        <div className="cursor-pointer"><Link href="/" className="interactive-element flex items-center"><Image src="/hog.svg" alt="Logo" width={160} height={150} /></Link></div>
        <ul className="flex gap-10 w-full justify-center max-md:hidden ">
          <li className="hover:text-themecolor"><Link href="/" className='interactive-element'>Home</Link></li>
          <li className="hover:text-themecolor"><Link href="/#about" className='interactive-element'>About</Link></li>
          <li className="hover:text-themecolor"><Link href="/leaderboard" className='interactive-element'>Leaderboard</Link></li>
          <li className="hover:text-themecolor"><Link href="/community" className='interactive-element'>Community</Link></li>
          <li className="hover:text-themecolor"><Link href="/#contact" onClick={(e)=>handleAnchorClick(e,'contact')} className='interactive-element'>Contact</Link></li>
        </ul>

        <div className="md:hidden">
        <button onClick={toggleMenu} aria-label="Toggle menu" className="interactive-element link-underline hover:text-themecolor z-60">
        {isopen ? <RxCross1   size={24} /> : <RxHamburgerMenu size={24} />}
        </button>

        <div
          onClick={toggleMenu}
          className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300
      ${isopen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        />

       
          <ul className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-black/10 backdrop-blur-md
      flex flex-col gap-10 items-center justify-center
      text-white text-4xl font-teko
      z-50 transform transition-transform duration-300 ease-in-out
      ${isopen ? 'translate-x-0' : 'translate-x-full'}
    `}>
          <li className="hover:text-themecolor"><Link href="/" className='interactive-element'>Home</Link></li>
          <li className="hover:text-themecolor"><Link href="/#about" className='interactive-element'>About</Link></li>
          <li className="hover:text-themecolor"><Link href="/leaderboard" className='interactive-element'>Leaderboard</Link></li>
          <li className="hover:text-themecolor"><Link href="/community" className='interactive-element'>Community</Link></li>
          <li className="hover:text-themecolor"><Link href="/#contact" onClick={(e)=>handleAnchorClick(e,'contact')} className='interactive-element'>Contact</Link></li>
        </ul>
        
        </div>
      </nav>
  )
}

export default Navbar