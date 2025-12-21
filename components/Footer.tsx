'use client'
import { FaInstagram, FaLinkedin } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Link from 'next/link'

const Footer = () => {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
  return (
    <footer className='relative w-full bg-black pt-5 pb-2 px-4 md:px-8 border-t border-gray-800'>

      <div className='relative z-10 max-w-7xl mx-auto'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand Section */}
          <div className='flex flex-col gap-4'>
            <div>
              <h3 className='text-2xl font-teko font-bold text-white drop-shadow-lg'>HOUSE OF</h3>
              <h3 className='text-2xl font-teko font-bold text-themecolor drop-shadow-lg'>GEEKS</h3>
            </div>
            <p className='text-gray-300 text-sm font-montserrat leading-relaxed'>
              The official technical society of IIIT Ranchi, fostering innovation and excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div className='flex flex-col gap-4'>
            <h4 className='text-lg font-teko font-bold text-white'>QUICK LINKS</h4>
            <div className='flex flex-col gap-2'>
              <a
                href="#about"
                onClick={(e) => handleSmoothScroll(e, 'about')}
                className='text-gray-300 hover:text-themecolor transition-colors duration-300 font-montserrat text-sm group flex items-center gap-2'
              >
                <span className='h-0.5 w-0 bg-themecolor group-hover:w-4 transition-all duration-300'></span>
                About Us
              </a>
              <Link
                href="#contact"
                className='text-gray-300 hover:text-themecolor transition-colors duration-300 font-montserrat text-sm group flex items-center gap-2'
              >
                <span className='h-0.5 w-0 bg-themecolor group-hover:w-4 transition-all duration-300'></span>
                Contact Us
              </Link>
              <Link
                href="#events"
                className='text-gray-300 hover:text-themecolor transition-colors duration-300 font-montserrat text-sm group flex items-center gap-2'
              >
                <span className='h-0.5 w-0 bg-themecolor group-hover:w-4 transition-all duration-300'></span>
                Events
              </Link>
              <Link
                href="#community"
                className='text-gray-300 hover:text-themecolor transition-colors duration-300 font-montserrat text-sm group flex items-center gap-2'
              >
                <span className='h-0.5 w-0 bg-themecolor group-hover:w-4 transition-all duration-300'></span>
                Community
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className='flex flex-col gap-4'>
            <h4 className='text-lg font-teko font-bold text-white'>CONTACT</h4>
            <div className='flex flex-col gap-3'>
              <a
                href='mailto:contact@houseofgeeks.in'
                className='flex items-center gap-3 text-gray-300 hover:text-themecolor transition-all duration-300 group'
              >
                <div className='p-2 bg-gray-800 group-hover:bg-themecolor/20 rounded-lg transition-all duration-300'>
                  <MdEmail size={20} className='text-themecolor' />
                </div>
                <span className='text-sm font-montserrat'>contact@hg.com</span>
              </a>
              <p className='text-gray-400 text-sm font-montserrat'>
                📍 IIIT Ranchi, Jharkhand
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className='flex flex-col gap-4'>
            <h4 className='text-lg font-teko font-bold text-white'>FOLLOW US</h4>
            <div className='flex gap-4'>
              <a
                href='https://instagram.com/houseofgeeks'
                target='_blank'
                rel='noopener noreferrer'
                className='relative group'
                aria-label='Instagram'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-themecolor to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300'></div>
                <div className='relative flex items-center justify-center w-12 h-12 bg-gray-800 rounded-lg group-hover:bg-themecolor transition-all duration-300 hover:scale-110'>
                  <FaInstagram size={24} className='text-themecolor group-hover:text-white' />
                </div>
              </a>
              <a
                href='https://linkedin.com/company/houseofgeeks'
                target='_blank'
                rel='noopener noreferrer'
                className='relative group'
                aria-label='LinkedIn'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-themecolor to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300'></div>
                <div className='relative flex items-center justify-center w-12 h-12 bg-gray-800 rounded-lg group-hover:bg-themecolor transition-all duration-300 hover:scale-110'>
                  <FaLinkedin size={24} className='text-themecolor group-hover:text-white' />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
