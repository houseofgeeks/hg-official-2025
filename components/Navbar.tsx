'use client'
import Image from "next/image";
import { useState } from "react";
import { RxHamburgerMenu, RxCross1 } from 'react-icons/rx';
const Navbar = () => {
  const [isopen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isopen)
  }

  return (
      <nav className="flex margin-x-auto  text-white  items-center text-3xl font-teko justify-between md:mr-20 mr-0">
        <div className="cursor-pointer"><Image src="/hog.svg" alt="Logo" width={160} height={150} /></div>
        <ul className="flex gap-10 w-full justify-center max-md:hidden ">
          <li className="hover:text-themecolor link-underline">Home</li>
          <li className="hover:text-themecolor link-underline">About</li>
          <li className="hover:text-themecolor link-underline">Leaderboard</li>
          <li className="hover:text-themecolor link-underline">Community</li>
          <li className="hover:text-themecolor link-underline">Contact</li>
        </ul>

        <div className="md:hidden">
        <button onClick={toggleMenu} aria-label="Toggle menu" className=" link-underline hover:text-themecolor z-60">
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
          <li className="hover:text-themecolor link-underline">Home</li>
          <li className="hover:text-themecolor link-underline">About</li>
          <li className="hover:text-themecolor link-underline">Leaderboard</li>
          <li className="hover:text-themecolor link-underline">Community</li>
        </ul>
        
        </div>



       
      </nav>
    
    
  )
}

export default Navbar