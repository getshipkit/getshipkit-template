"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function DesignedForSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.25,
      }
    );
    
    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.disconnect();
      }
    };
  }, []);

  const audiences = [
    {
      title: "Vibe Coders",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
        </svg>
      ),
      description: "Perfect for creative developers who prioritize aesthetics and user experience, blending beautiful design with robust functionality to craft memorable digital experiences."
    },
    {
      title: "SaaS Founders",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      description: "Built for SaaS entrepreneurs who want to focus on product and customer acquisition instead of reinventing infrastructure and auth systems."
    },
    {
      title: "Indie Developers",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 18l2-2-2-2" />
          <path d="M8 18l-2-2 2-2" />
          <path d="M10 18l4-6" />
        </svg>
      ),
      description: "Designed for solo developers and small teams with the flexibility to build and deploy production-ready applications with minimal overhead."
    },
    {
      title: "Enterprise Teams",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      description: "Ideal for innovation teams within larger organizations that need to prototype and launch new products without compromising on security or compliance."
    },
    {
      title: "Side Projects",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      description: "Perfect for developers working on side projects who want to maximize impact with limited time, with a complete stack that just works."
    },
    {
      title: "Agency Developers",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      description: "Streamlines client project setup and delivery with a consistent, reliable foundation that can be customized for each client's specific needs."
    }
  ];

  return (
    <section 
      id="designed-for" 
      className="relative py-24 bg-[#0a0c14] overflow-hidden border-t border-white/5"
      ref={sectionRef}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute bottom-[10%] right-[10%] w-72 h-72 bg-[#10b981] rounded-full filter blur-[120px]"></div>
        <div className="absolute top-[20%] left-[5%] w-60 h-60 bg-[#10b981]/30 rounded-full filter blur-[100px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[rgba(255,255,255,0.1)] rounded-full px-4 py-2 mb-4 backdrop-blur-sm border border-white/10">
            <div className="w-2 h-2 bg-[#10b981] rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-medium text-white tracking-wider">WHO IT&apos;S FOR</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#a7f3d0] to-[#10b981] leading-tight">
            Designed For Modern <br className="md:hidden" />Builders & Teams
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you&apos;re a solo developer or part of a larger team, our boilerplate adapts to your specific needs.
          </p>
        </div>
        
        {/* Grid of audience cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-1 rounded-xl bg-gradient-to-r from-[#10b981]/10 to-[#a7f3d0]/5"
            >
              <div className="h-full bg-[#0a0c14]/60 backdrop-blur-sm border border-white/5 hover:border-[#10b981]/20 rounded-lg p-6 transition-all duration-300">
                <div className="text-[#10b981] mb-4">
                  {audience.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {audience.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {audience.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="mt-16 text-center">
          <a 
            href="#" 
            className="inline-flex items-center bg-transparent border-2 border-[#10b981] hover:border-[#a7f3d0] text-white hover:text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg shadow-[#10b981]/20 hover:shadow-[#10b981]/40 hover:-translate-y-0.5"
          >
            <span>Start Building Today</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
} 