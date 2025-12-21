'use client'
import { FaInstagram, FaLinkedin } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

const Footer = () => {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className='relative w-full bg-black/50 backdrop-blur-sm border-t border-themecolor/20 py-8 px-4'>
      <div className='max-w-7xl mx-auto'>
        
        {/* Main Content */}
        <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
          
          {/* Left - Branding */}
          <div className='flex flex-col gap-1'>
            <h3 className='text-lg font-teko font-bold text-white'>HOUSE OF GEEKS</h3>
            <p className='text-xs text-gray-400 font-montserrat'>IIIT Ranchi Official Tech Society</p>
          </div>

          {/* Center - Quick Links */}
          <div className='flex gap-6 flex-wrap justify-center'>
            <a href='#about' onClick={(e) => handleSmoothScroll(e, 'about')} className='text-xs text-gray-300 hover:text-themecolor transition-colors duration-300 font-montserrat'>
              About
            </a>
            <a href='#contact' className='text-xs text-gray-300 hover:text-themecolor transition-colors duration-300 font-montserrat'>
              Contact
            </a>
            <a href='#events' className='text-xs text-gray-300 hover:text-themecolor transition-colors duration-300 font-montserrat'>
              Events
            </a>
            <a href='#community' className='text-xs text-gray-300 hover:text-themecolor transition-colors duration-300 font-montserrat'>
              Community
            </a>
          </div>

          {/* Right - Social & Contact */}
          <div className='flex items-center gap-4'>
            <a href='mailto:contact@houseofgeeks.in' className='text-gray-400 hover:text-themecolor transition-colors duration-300' aria-label='Email'>
              <MdEmail size={18} />
            </a>
            <a href='https://instagram.com/houseofgeeks' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-themecolor transition-colors duration-300' aria-label='Instagram'>
              <FaInstagram size={16} />
            </a>
            <a href='https://linkedin.com/company/houseofgeeks' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-themecolor transition-colors duration-300' aria-label='LinkedIn'>
              <FaLinkedin size={16} />
            </a>
          </div>
        </div>

        {/* Bottom Divider & Copyright */}
        <div className='mt-6 pt-4 border-t border-gray-800/50'>
          <p className='text-xs text-gray-500 text-center font-montserrat'>© 2025 House of Geeks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
