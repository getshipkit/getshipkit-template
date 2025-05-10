"use client";

import Link from 'next/link';
import { useState, useEffect, memo } from 'react';

// Memoize the component to prevent unnecessary re-renders
const HeroSection = memo(function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Use a separate effect for animation timing to avoid blocking the main thread
  useEffect(() => {
    // Add a small delay to ensure the page is interactive before animation starts
    const animationTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(animationTimer);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#0a0c14] text-white flex flex-col items-center justify-start pt-20 md:pt-28 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c14] via-[#0a0c14] to-[#13151d] z-0"></div>
      
      {/* Decorative elements - simplified for better performance */}
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-30">
        <div className="absolute top-[5%] right-[45%] w-64 h-64 bg-[#10b981] rounded-full filter blur-[120px]"></div>
        <div className="absolute bottom-[15%] left-[10%] w-64 h-64 bg-[#10b981]/30 rounded-full filter blur-[100px]"></div>
      </div>
      
      {/* Main Content */}
      <div className={`container mx-auto max-w-5xl text-center z-10 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="inline-flex items-center bg-[rgba(255,255,255,0.1)] rounded-full px-5 py-2.5 mb-10 backdrop-blur-sm border border-white/10">
          <div className="w-2 h-2 bg-[#10b981] rounded-full mr-3 animate-pulse"></div>
          <span className="text-sm font-medium tracking-wider">GETSHIPKIT PRESENTS</span>
        </div>
        
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-br from-white via-[#74e8c0] to-[#059669] leading-tight tracking-tight">
          WORLD&apos;S FASTEST<br />SAAS STARTER
        </h1>
        
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          Join thousands of developers who ship production-ready<br className="hidden md:block" />
          SaaS applications in minutes, not months.
        </p>
        
        <div className="mb-10">
          <div className="inline-flex items-center bg-[rgba(255,255,255,0.05)] rounded-full px-7 py-4 backdrop-blur-sm border border-white/10 hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300">
            <span className="text-white font-semibold">Focus on your <span className="text-yellow-400">product</span>, not <span className="text-[#0eff9e]">infrastructure</span></span>
          </div>
        </div>
        
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link 
            href="#" 
            className="bg-transparent border-2 border-[#10b981] hover:border-[#a7f3d0] text-white hover:text-white px-8 py-3 rounded-full font-medium transition-all duration-300 inline-flex items-center text-base hover:shadow-lg hover:shadow-[#10b981]/50 hover:-translate-y-1 group"
          >
            Get Started Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          
          <Link 
            href="#" 
            className="bg-transparent text-white border border-white/20 hover:border-white/40 px-8 py-3 rounded-full font-medium transition-all duration-300 inline-flex items-center text-base hover:bg-white/5 hover:-translate-y-1"
          >
            View Docs
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
});

export default HeroSection; 