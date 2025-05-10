"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
// Removed manual font loading with Head component - should be handled in _app or layout

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Handle active section based on scroll position
      const sections = ['features', 'designed-for', 'how-it-helps', 'pricing', 'testimonials', 'faq'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && 
            scrollPosition >= element.offsetTop && 
            scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(section);
          return;
        }
      }
      
      // If we're above all sections or no sections found
      setActiveSection('home');
    };
    
    // Use passive event listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { name: 'Home', href: '/', section: 'home' },
    { name: 'Features', href: '#features', section: 'features' },
    { name: 'Who It\'s For', href: '#designed-for', section: 'designed-for' },
    { name: 'How It Helps', href: '#how-it-helps', section: 'how-it-helps' },
    { name: 'Pricing', href: '#pricing', section: 'pricing' },
    { name: 'Testimonials', href: '#testimonials', section: 'testimonials' },
    { name: 'FAQ', href: '#faq', section: 'faq' },
  ];
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <div 
          className={`mx-auto max-w-5xl rounded-full transition-all duration-300 ${
            scrolled 
              ? 'bg-[#0a0c14] backdrop-blur-lg shadow-lg shadow-black/10 border border-white/10' 
              : 'bg-[#0a0c14] backdrop-blur-md border border-white/5'
          }`}
        >
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 group" 
              aria-label="GetShipkit Home" 
              prefetch={false}
            >
              <div className="w-8 h-8 rounded-full bg-transparent border-2 border-[#15d99a] flex items-center justify-center shadow-lg shadow-[#15d99a]/20 group-hover:shadow-[#15d99a]/40 transition-all duration-300" style={{ contain: 'layout paint', width: '32px', height: '32px' }}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                  width="16"
                  height="16"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight m-0 leading-none" style={{WebkitFontSmoothing: 'antialiased', contain: 'content'}}>
                Get<span className="text-[#15d99a]">Shipkit</span>
              </h1>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-0">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className={`px-3 py-2 font-medium transition-colors text-xs relative ${
                    activeSection === item.section 
                      ? 'text-[#15d99a]' 
                      : 'text-white hover:text-white'
                  }`}
                  prefetch={false}
                  aria-current={activeSection === item.section ? 'page' : undefined}
                >
                  {item.name}
                  {activeSection === item.section && (
                    <span 
                      className="absolute bottom-0 left-0 right-0 mx-auto w-1/3 h-0.5 bg-[#15d99a] rounded-full"
                      style={{ transform: 'translateZ(0)' }}
                      aria-hidden="true"
                    ></span>
                  )}
                </Link>
              ))}
              <Link 
                href="/sign-up" 
                className="ml-4 bg-transparent border-2 border-[#15d99a] hover:border-[#a7f3d0] text-white hover:text-white px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg shadow-[#15d99a]/20 hover:shadow-[#15d99a]/40 hover:-translate-y-0.5"
                prefetch={false}
              >
                Sign Up
              </Link>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                className="focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 hover:border-[#15d99a]/50 transition-colors duration-300">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    width="16"
                    height="16"
                  >
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </div>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div 
              id="mobile-menu"
              className="md:hidden w-full bg-[#0a0c14] backdrop-blur-lg shadow-lg border-t border-white/10 p-4 rounded-b-3xl overflow-hidden"
              style={{ willChange: 'transform' }}
            >
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href} 
                    className={`px-4 py-3 font-medium transition-colors rounded-lg ${
                      activeSection === item.section 
                        ? 'text-[#15d99a] bg-white/5 border-l-2 border-[#15d99a]' 
                        : 'text-white hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    prefetch={false}
                    aria-current={activeSection === item.section ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
                <hr className="border-white/10 my-2" />
                <div className="flex flex-col space-y-3 pt-2">
                  <Link 
                    href="/sign-up" 
                    className="bg-transparent border-2 border-[#15d99a] hover:border-[#a7f3d0] text-white hover:text-white px-4 py-3 rounded-full font-medium transition-all duration-300 text-center shadow-lg shadow-[#15d99a]/20 hover:shadow-[#15d99a]/40"
                    onClick={() => setMobileMenuOpen(false)}
                    prefetch={false}
                  >
                    Sign Up
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
} 