import Link from 'next/link';

export default function Notfound(){
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4 py-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className='absolute top-0 left-0 w-96 h-96 bg-themecolor/20 rounded-full blur-3xl opacity-40 animate-pulse'></div>
      <div className='absolute bottom-0 right-0 w-80 h-80 bg-themecolor/15 rounded-full blur-3xl opacity-30 animate-pulse' style={{animationDelay: '2s'}}></div>

      {/* Content */}
      <div className='relative z-10 flex flex-col items-center justify-center gap-8 max-w-2xl'>
        
        {/* 404 Number with Gradient */}
        <div className='relative'>
          <h1 className='text-9xl md:text-[150px] font-teko font-black text-transparent bg-clip-text bg-gradient-to-r from-themecolor to-themecolor drop-shadow-lg'>
            404
          </h1>
          <div className='absolute inset-0 text-9xl md:text-[150px] font-teko font-black text-themecolor/20 blur-xl'>
            404
          </div>
        </div>

        {/* Heading */}
        <div className='text-center gap-3 flex flex-col'>
          <h2 className='text-3xl md:text-5xl font-teko font-bold text-white'>PAGE NOT FOUND</h2>
          <div className='h-1 w-24 bg-themecolor mx-auto'></div>
        </div>

        {/* Description */}
        <p className='text-center text-gray-300 font-montserrat text-base md:text-lg max-w-md leading-relaxed'>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track!
        </p>

        {/* Buttons */}
        <div className='flex flex-col md:flex-row gap-4 mt-4'>
          <Link
            href="/"
            className='group relative px-8 py-3 rounded-lg font-teko font-bold text-lg overflow-hidden'
          >
            <div className='absolute inset-0 bg-themecolor opacity-100 group-hover:opacity-90 transition-opacity duration-300'></div>
            <span className='relative flex items-center justify-center text-white'>
              ← BACK HOME
            </span>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className='mt-12 flex gap-2 justify-center'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='w-2 h-2 rounded-full bg-themecolor/40 hover:bg-themecolor transition-all duration-300'
              style={{animationDelay: `${i * 0.2}s`}}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}