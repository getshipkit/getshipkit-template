"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function CTASection() {
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

  return (
    <section className="py-28 px-4 relative overflow-hidden bg-[#0a0c14]" ref={sectionRef}>
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-[30%] left-[10%] w-72 h-72 bg-[#10b981] rounded-full filter blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[5%] w-64 h-64 bg-[#10b981]/30 rounded-full filter blur-[100px]"></div>
      </div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="bg-[#111827]/80 backdrop-blur-lg border border-gray-800 hover:border-[#10b981]/20 p-12 md:p-16 rounded-3xl text-center shadow-2xl relative overflow-hidden transition-all duration-300"
        >
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:16px_16px]"></div>
          <div className="relative">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#a7f3d0] to-[#10b981] tracking-tight"
            >
              Ready to accelerate your project?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg"
            >
              Start building with GetShipKit today and launch in record time.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link 
                href="/sign-up" 
                className="bg-transparent border-2 border-[#10b981] hover:border-[#a7f3d0] text-white hover:text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-[#10b981]/20 hover:shadow-[#10b981]/40 hover:-translate-y-1 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                Get Started Now
              </Link>
              <Link 
                href="#features" 
                className="border border-gray-700 hover:border-[#10b981]/50 bg-transparent text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:bg-[#10b981]/10 hover:-translate-y-1"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 