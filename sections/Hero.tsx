'use client'
import FuzzyText from '../components/FuzzyText';
import ShinyText from '../components/ShinyText';
import TextType from '../components/TextType';
import Button from '../components/Button';
import Link from 'next/link';

const Hero = () => {
  const scrollToDomains = () => {
    const domainsSection = document.getElementById('domains');
    if (domainsSection) {
      domainsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="flex flex-col items-center justify-center pt-17 gap-6">
        <h1 className="sm:text-8xl md:text-9xl text-white font-montserrat font-bold flex flex-col gap-3 justify-center text-center text-7xl ">HOUSE OF 
            <FuzzyText>GEEKS</FuzzyText>
        </h1>
        <div>
            <ShinyText text="Technical Society of IIIT Ranchi" className='text-2xl font-montserrat text-center'></ShinyText>
        </div>
        <div>
            <TextType 
                text={["Building innovators", "Empowering developers","Shaping the future of technology"]}
                typingSpeed={60}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                variableSpeed={false}
                onSentenceComplete={() => {}}
                className='text-white text-2xl font-montserrat font-bold text-center'
            />
        </div>
        <div className='sm:flex-row flex items-center justify-between sm:gap-10 flex-col gap-5'>
            <Link href="/community">
              <Button text='View The Community →' classname='interactive-element text-lg text-white border-themecolor border-2 font-montserrat font-semibold rounded-lg px-5 py-3 bg-themecolor hover:text-black'>
              </Button>
            </Link>
            <Button text='Explore Domains' onClick={scrollToDomains} classname='interactive-element text-lg text-white border-2 border-themecolor font-montserrat font-semibold rounded-lg px-5 py-3 hover:text-themecolor transition-all duration-300'>
            </Button>
        </div>
    </section>
  )
}

export default Hero