'use client'
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'
import { MdEmail, MdLocationOn } from 'react-icons/md'

const Footer = () => {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className='relative w-full bg-black py-8 px-4 md:px-8 border-t-2 border-themecolor/30'>
      <div className='max-w-7xl mx-auto'>
        
        {/* Main Content Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 '>
          
          {/* Brand Section */}
          <div className='flex flex-col gap-4'>
            <div>
              <h3 className='text-3xl font-teko font-bold text-white'>HOUSE</h3>
              <h3 className='text-3xl font-teko font-bold text-themecolor'>OF GEEKS</h3>
              <div className='h-1 w-20 bg-gradient-to-r from-themecolor to-purple-500 mt-3'></div>
            </div>
            <p className='text-gray-300 font-montserrat text-sm leading-relaxed'>
              The official technical society of IIIT Ranchi, fostering innovation, collaboration, and technical excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div className='flex flex-col gap-4'>
            <h4 className='text-lg font-teko font-bold text-white'>QUICK LINKS</h4>
            <div className='flex flex-col gap-2'>
              <a href='#about' onClick={(e) => handleSmoothScroll(e, 'about')} className='text-gray-300 hover:text-themecolor transition-colors duration-300 font-montserrat text-sm group flex items-center gap-2 cursor-pointer'>
                <span className='w-0 h-0.5 bg-themecolor group-hover:w-4 transition-all duration-300'></span>
                About Us
              </a>
              <a href='#contact' className='text-gray-300 hover:text-themecolor transition-colors duration-300 font-montserrat text-sm group flex items-center gap-2 cursor-pointer'>
                <span className='w-0 h-0.5 bg-themecolor group-hover:w-4 transition-all duration-300'></span>
                Contact Us
              </a>
              <a href='#events' className='text-gray-300 hover:text-themecolor transition-colors duration-300 font-montserrat text-sm group flex items-center gap-2 cursor-pointer'>
                <span className='w-0 h-0.5 bg-themecolor group-hover:w-4 transition-all duration-300'></span>
                Events
              </a>
              <a href='#community' className='text-gray-300 hover:text-themecolor transition-colors duration-300 font-montserrat text-sm group flex items-center gap-2 cursor-pointer'>
                <span className='w-0 h-0.5 bg-themecolor group-hover:w-4 transition-all duration-300'></span>
                Community
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className='flex flex-col gap-4'>
            <h4 className='text-lg font-teko font-bold text-white'>CONTACT US</h4>
            <div className='flex flex-col gap-3'>
              <a href='mailto:contact@houseofgeeks.in' className='flex items-center gap-3 text-gray-300 hover:text-themecolor transition-all duration-300 group'>
                <div className='w-12 h-12 rounded-lg bg-themecolor/10 flex items-center justify-center group-hover:bg-themecolor/20 transition-all duration-300'>
                  <MdEmail size={22} className='text-themecolor' />
                </div>
                <div>
                  <p className='font-montserrat text-xs text-gray-400'>Email</p>
                  <p className='font-montserrat text-sm'>contact@hg.com</p>
                </div>
              </a>
              <a href='#' className='flex items-center gap-3 text-gray-300 hover:text-themecolor transition-all duration-300 group'>
                <div className='w-12 h-12 rounded-lg bg-themecolor/10 flex items-center justify-center group-hover:bg-themecolor/20 transition-all duration-300'>
                  <MdLocationOn size={22} className='text-themecolor' />
                </div>
                <div>
                  <p className='font-montserrat text-xs text-gray-400'>Location</p>
                  <p className='font-montserrat text-sm'>IIIT Ranchi, Jharkhand</p>
                </div>
              </a>
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
                className='group relative'
                aria-label='Instagram'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-themecolor to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300'></div>
                <div className='relative w-14 h-14 rounded-xl bg-themecolor/10 flex items-center justify-center group-hover:bg-themecolor transition-all duration-300 border border-themecolor/30'>
                  <FaInstagram size={24} className='text-themecolor group-hover:text-white transition-colors duration-300' />
                </div>
              </a>
              <a
                href='https://linkedin.com/company/houseofgeeks'
                target='_blank'
                rel='noopener noreferrer'
                className='group relative'
                aria-label='LinkedIn'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-themecolor to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300'></div>
                <div className='relative w-14 h-14 rounded-xl bg-themecolor/10 flex items-center justify-center group-hover:bg-themecolor transition-all duration-300 border border-themecolor/30'>
                  <FaLinkedin size={24} className='text-themecolor group-hover:text-white transition-colors duration-300' />
                </div>
              </a>
              <a
                href='https://github.com/houseofgeeks'
                target='_blank'
                rel='noopener noreferrer'
                className='group relative'
                aria-label='GitHub'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-themecolor to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300'></div>
                <div className='relative w-14 h-14 rounded-xl bg-themecolor/10 flex items-center justify-center group-hover:bg-themecolor transition-all duration-300 border border-themecolor/30'>
                  <FaGithub size={24} className='text-themecolor group-hover:text-white transition-colors duration-300' />
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
