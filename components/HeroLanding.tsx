// components/HeroLanding.tsx or app/page.tsx (For Next.js App Router)

import Link from 'next/link';
import { Timeline } from './ui/timeline';

// NOTE: Ensure 'large (1).mp4' is in your 'public/videos/' folder.
const L1_VIDEO_URL = '/landingpage.mp4'; 

const HeroLanding: React.FC = () => {
  const data = [
  {
    title: "Vision",
    content: (
      <div>
        <p className="mb-4 text-8xl font-semibold text-neutral-900 md:text-base dark:text-neutral-100">
          The Operating System for India's ₹35,000 Cr Millet Economy
        </p>
        <p className="mb-8 text-xs font-normal text-neutral-700 md:text-sm dark:text-neutral-300">
          Krushi Shetra unifies 5 million farmers, 2 lakh SHGs, processors, and consumers on one platform—backed by blockchain traceability, AI-powered quality grading, and real-time market intelligence. We're building infrastructure, not just a marketplace.
        </p>
        
        <img
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop"
          alt="Indian farmer in millet field with smartphone"
          width={800}
          height={500}
          className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-64 lg:h-80"
        />
      </div>
    ),
  },
  {
    title: "The Problem",
    content: (
      <div>
        <p className="mb-4 text-sm font-semibold text-neutral-900 md:text-base dark:text-neutral-100">
          Critical Bottlenecks in India's Millet Value Chain
        </p>
        <p className="mb-6 text-xs font-normal text-neutral-700 md:text-sm dark:text-neutral-300">
          Despite being designated as "Shree Anna," the millet sector faces severe structural challenges that prevent farmers from realizing fair value and limit consumer access to authentic products.
        </p>
        
        <img
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop"
          alt="Fragmented agricultural supply chain visualization"
          width={800}
          height={500}
          className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-64 lg:h-80"
        />
      </div>
    ),
  },
  {
    title: "Core Innovation",
    content: (
      <div>
        <p className="mb-4 text-sm font-semibold text-neutral-900 md:text-base dark:text-neutral-100">
          AI + Blockchain-Powered Multi-Stakeholder Ecosystem
        </p>
        <p className="mb-6 text-xs font-normal text-neutral-700 md:text-sm dark:text-neutral-300">
          Beyond traditional marketplaces, Krushi Shetra deploys cutting-edge technology to solve trust, quality, and accessibility challenges simultaneously.
        </p>
        
        <img
          src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop"
          alt="AI and blockchain technology visualization"
          width={800}
          height={500}
          className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-64 lg:h-80"
        />
      </div>
    ),
  },
  {
    title: "Business Model",
    content: (
      <div>
        <p className="mb-4 text-sm font-semibold text-neutral-900 md:text-base dark:text-neutral-100">
          5 Diversified Revenue Streams = Sustainable Growth
        </p>
        <p className="mb-6 text-xs font-normal text-neutral-700 md:text-sm dark:text-neutral-300">
          Unlike generic marketplaces dependent on transaction fees, Krushi Shetra captures value across the entire ecosystem with multiple high-margin revenue channels.
        </p>
       
        <img
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop"
          alt="Business growth and revenue analytics dashboard"
          width={800}
          height={500}
          className="w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-64 lg:h-80"
        />
      </div>
    ),
  }]
  return (
    <>
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      
      {/* 1. Full-Screen Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute top-0 left-0 object-cover w-full h-full min-w-full min-h-full"
      >
        <source src={L1_VIDEO_URL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay with a subtle gradient fade to black at the bottom for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-black/40"></div>
      
      {/* 2. Navbar - Fixed, Blurred, and Animated */}
      <nav className="fixed top-0 left-0 z-50 w-full p-4 md:p-6 animate-fade-in">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm -z-10"></div>
          
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          {/* Platform Name/Logo */}
          <Link 
            href="/" 
            className="text-3xl font-extrabold tracking-tight text-white transition duration-300 hover:text-green-400 drop-shadow-md"
          >
            Krishi Shetra
          </Link>
          
          {/* Action Button */}
          <Link 
            href="/shop" 
            className="px-5 py-2 text-base font-semibold text-black transition duration-300 rounded-full bg-green-400 hover:bg-green-500 shadow-xl"
          >
            Shop Shree Anna
          </Link>
        </div>
      </nav>

      {/* 3. Central Hero Content (The Main Headline and CTA) */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full p-4 text-center">
        
        {/* Main Headline with a slight upward slide animation */}
        <h1 className="text-5xl font-extrabold leading-tight text-white md:text-8xl drop-shadow-2xl max-w-5xl animate-fade-in-up">
          <span className="text-green-400">From Forgotten Grains</span> to Future Foods
        </h1>
        
        {/* Subheadline with a slight delay */}
        <p className="max-w-4xl mt-6 text-xl font-medium text-white/90 md:text-2xl drop-shadow-lg animate-fade-in delay-300">
          Empowering 5 Million Farmers, 2 Lakh Women SHGs, and Health-Conscious Consumers Through India's Most Inclusive Millet Platform
        </p>

        {/* Action Button */}
        <button 
          className="px-10 py-4 mt-12 text-lg font-bold text-black transition duration-500 transform bg-white rounded-full shadow-2xl hover:scale-[1.05] hover:bg-gray-100 ring-4 ring-green-400 ring-opacity-50 animate-bounce-once"
        >
          Discover Our Impact
        </button>
      </div>

      {/* 4. Social Proof / Impact Bar (Fixed at the bottom for modern aesthetic) */}
      <div className="absolute bottom-0 left-0 z-30 w-full p-4 bg-black/50 backdrop-blur-md">
        <div className="mx-auto text-sm text-white md:text-base max-w-7xl md:flex md:items-center md:justify-between">
            {/* Impact Description (Slide-in from right animation) */}
            <p className="mb-2 font-light text-white/80 md:mb-0 max-w-xl animate-slide-in-right">
                Krishi Shetra transforms lives: Farmers earn 68% more. SHGs build sustainable enterprises. Consumers get authentic Shree Anna with transparency.
            </p>

            {/* Social Proof Badges */}
            <div className="flex items-center justify-center space-x-6 font-semibold animate-fade-in delay-700">
                <span className="text-sm text-green-300">TRUSTED BY 500+ FPOs</span>
                <span className="text-sm text-white/70">|</span>
                <span className="text-sm text-yellow-300">CERTIFIED by FSSAI & Agmark</span>
            </div>
        </div>
      </div>
      
    </div>
    <Timeline  data={data} />
  </>);
};

export default HeroLanding;