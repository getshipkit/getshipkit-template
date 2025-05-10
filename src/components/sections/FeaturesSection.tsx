"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeaturesSection() {
  const [activeTab, setActiveTab] = useState(0);
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
        threshold: 0.15,
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
  
  // Features data
  const features = [
    {
      title: "Next.js 15",
      description: "Latest Next.js with App Router, Server Components, and built-in TypeScript support",
      icon: (
        <svg viewBox="0 0 180 180" fill="none" className="w-7 h-7">
          <mask id="mask0_408_139" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
            <circle cx="90" cy="90" r="90" fill="black" />
          </mask>
          <g mask="url(#mask0_408_139)">
            <circle cx="90" cy="90" r="90" fill="black" />
            <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_139)" />
            <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_408_139)" />
          </g>
          <defs>
            <linearGradient id="paint0_linear_408_139" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint1_linear_408_139" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      ),
      color: "#000000",
      accentColor: "#ffffff",
      docsUrl: "https://nextjs.org/docs",
      whyWeChose: "Next.js offers the perfect balance of developer experience and performance. The App Router architecture enables full-stack React applications with Server Components, which drastically improve loading times and reduce client-side JavaScript. Built-in optimizations for images, fonts, and scripts mean we don't have to reinvent the wheel for every project. With both static and dynamic rendering options, we can choose the right approach for each page, and features like Incremental Static Regeneration give us the best of both worlds."
    },
    {
      title: "TypeScript",
      description: "Type-safe JavaScript for large-scale applications with enhanced developer experience",
      icon: (
        <svg viewBox="0 0 400 400" fill="none" className="w-7 h-7">
          <path fillRule="evenodd" clipRule="evenodd" d="M0 200V0H400V400H0V200Z" fill="#007ACC" />
          <path fillRule="evenodd" clipRule="evenodd" d="M87.7461 200.641V217.948H116.227V304.5H152.631V217.948H181.111V200.946C181.111 191.732 181.01 183.742 180.807 183.64C180.706 183.437 165.632 183.336 147.196 183.336L113.788 183.539L87.7461 200.641Z" fill="white" />
          <path fillRule="evenodd" clipRule="evenodd" d="M217.818 183.234C231.568 187.041 240.885 193.405 249.186 204.448C253.196 209.983 258.536 218.893 259.145 221.989C259.247 222.701 245.498 231.815 237.298 236.944C236.689 237.35 235.266 235.824 233.64 232.83C228.504 223.11 223.266 219.1 214.353 218.08C201.821 216.655 193.52 223.818 193.52 236.335C193.52 240.65 194.027 243.035 195.552 246.436C198.851 253.701 205.002 258.222 219.87 265.487C248.78 279.748 263.145 289.164 271.547 301.404C280.558 314.66 282.795 334.817 276.886 350.505C270.367 367.912 253.806 379.464 230.344 383.067C220.823 384.288 204.19 383.982 193.825 382.254C174.683 379.057 156.763 369.031 146.529 355.775C142.214 349.614 134.828 336.155 135.742 334.629L139.96 332.092L153.913 324.196L164.146 318.137L167.648 323.874C171.963 331.77 180.365 339.666 186.478 342.558C203.378 350.454 225.615 348.319 236.155 337.986C241.596 332.448 243.528 326.49 243.02 318.594C242.512 312.331 241.393 309.439 237.585 304.805C232.448 298.745 221.396 292.279 200.194 281.743C175.902 269.909 167.144 262.949 158.437 251.18C153.301 244.32 148.164 232.83 146.435 224.628C144.91 217.363 144.503 201.37 145.723 193.983C150.452 168.779 167.751 151.474 193.621 146.346C202.225 144.515 220.958 144.82 230.65 146.853L217.818 183.234Z" fill="white" />
        </svg>
      ),
      color: "#007ACC",
      accentColor: "#ffffff",
      docsUrl: "https://www.typescriptlang.org/docs/",
      whyWeChose: "TypeScript significantly improves code quality and reduces bugs by catching type errors during development rather than at runtime. For larger applications and teams, TypeScript's static typing creates a self-documenting codebase that's easier to understand and maintain. The enhanced IDE experience with features like intelligent code completion, refactoring tools, and inline documentation makes developers more productive. While there's a small learning curve, the long-term benefits in reduced debugging time and improved code reliability make TypeScript an essential part of our stack."
    },
    {
      title: "Tailwind CSS",
      description: "Utility-first framework for building custom designs without leaving your HTML",
      icon: (
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
          <path fillRule="evenodd" clipRule="evenodd" d="M16 6.77579C13.3418 6.77579 11.5726 7.77801 10.6667 9.78244C11.7333 8.78021 13.0222 8.42138 14.5333 8.69496C15.4369 8.85419 16.0692 9.43123 16.7645 10.101C17.9474 11.2333 19.3223 12.5684 22.1333 12.5684C24.7915 12.5684 26.5608 11.5662 27.4667 9.56174C26.4 10.564 25.1111 10.9228 23.6 10.6492C22.6964 10.49 22.0641 9.91296 21.3688 9.24319C20.1859 8.11093 18.811 6.77579 16 6.77579ZM9.86667 12.7737C7.20848 12.7737 5.43924 13.7759 4.53333 15.7803C5.6 14.7781 6.88889 14.4193 8.4 14.6929C9.30365 14.8521 9.93591 15.4291 10.6312 16.0989C11.8141 17.2312 13.189 18.5663 16 18.5663C18.6582 18.5663 20.4274 17.5641 21.3333 15.5597C20.2667 16.5619 18.9778 16.9207 17.4667 16.6471C16.5631 16.4879 15.9308 15.9109 15.2355 15.2411C14.0526 14.1088 12.6777 12.7737 9.86667 12.7737Z" fill="#38BDF8"/>
        </svg>
      ),
      color: "#38BDF8",
      accentColor: "#0F172A",
      docsUrl: "https://tailwindcss.com/docs",
      whyWeChose: "Tailwind CSS dramatically speeds up the development process by eliminating the need to write custom CSS and switch between multiple files. Its utility-first approach keeps the codebase DRY by automatically removing unused CSS in production, resulting in minimal file sizes. The design system constraints built into Tailwind encourage consistency across the UI, while still allowing for complete customization when needed. With responsive design utilities and dark mode support built in, we can build modern interfaces without the headache of managing complex CSS architectures."
    },
    {
      title: "Clerk Auth",
      description: "Complete user management with authentication, profiles, and security features",
      icon: (
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
          <path d="M23.5294 13.137V10.9953C23.5294 6.56328 19.9358 3 15.5126 3C11.0798 3 7.49582 6.56328 7.49582 10.9953V13.137" stroke="#6C47FF" strokeWidth="3"/>
          <path d="M15.5177 19.4412V23.9118" stroke="#6C47FF" strokeWidth="3" strokeLinecap="round"/>
          <path d="M23.5232 29H7.48691C5.01055 29 3 26.9979 3 24.5324V18.0147C3 15.5492 5.01055 13.5471 7.48691 13.5471H23.5232C25.9996 13.5471 28.0102 15.5492 28.0102 18.0147V24.5324C28.0102 26.9979 25.9996 29 23.5232 29Z" fill="#6C47FF"/>
        </svg>
      ),
      color: "#6C47FF",
      accentColor: "#ffffff",
      docsUrl: "https://clerk.com/docs",
      whyWeChose: "Authentication and user management are critical yet complex components that require significant development time when built from scratch. Clerk provides a complete, production-ready solution with built-in security best practices like multi-factor authentication, fraud prevention, and session management. Its pre-built components for sign-in, sign-up, and user profiles save weeks of development time, while still allowing for complete customization to match our design system. With Clerk handling the complexity of auth, we can focus on building core product features that deliver value to users."
    },
    {
      title: "Supabase",
      description: "Open source Firebase alternative with PostgreSQL database and real-time features",
      icon: (
        <svg viewBox="0 0 109 113" fill="none" className="w-7 h-7">
          <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint0_linear)"/>
          <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint1_linear)" fillOpacity="0.2"/>
          <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="#3ECF8E"/>
          <defs>
          <linearGradient id="paint0_linear" x1="53.9738" y1="54.974" x2="94.1635" y2="71.5515" gradientUnits="userSpaceOnUse">
          <stop stopColor="#249361"/>
          <stop offset="1" stopColor="#3ECF8E"/>
          </linearGradient>
          <linearGradient id="paint1_linear" x1="36.1558" y1="30.578" x2="54.4844" y2="65.0806" gradientUnits="userSpaceOnUse">
          <stop/>
          <stop offset="1" stopOpacity="0"/>
          </linearGradient>
          </defs>
        </svg>
      ),
      color: "#3ECF8E",
      accentColor: "#1F1F1F",
      docsUrl: "https://supabase.io/docs",
      whyWeChose: "Supabase provides all the backend services we need in one platform: a PostgreSQL database, authentication, storage, and real-time subscriptions. Unlike proprietary solutions, Supabase is built on open-source technologies, eliminating vendor lock-in concerns and allowing direct access to the database when needed. Its row-level security makes implementing complex permission systems straightforward, while the real-time capabilities enable building collaborative features without managing WebSocket infrastructure. With generous free tiers and predictable pricing, Supabase scales cost-effectively from prototype to production."
    },
    {
      title: "Polar.sh",
      description: "Open source funding platform to monetize and sustain your open source projects",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#101827"/>
          <path d="M8.57 9.235C10.9474 9.235 12.8728 7.30965 12.8728 4.9322C12.8728 4.59918 12.833 4.27642 12.7581 3.9679C16.3619 4.87295 18.9859 8.10516 18.9859 11.9999C18.9859 16.4182 15.4042 19.9999 10.9859 19.9999C6.56761 19.9999 2.98596 16.4182 2.98596 11.9999C2.98596 10.9849 3.16685 10.0087 3.499 9.1036C4.5827 9.7131 5.85473 10.0552 7.21596 10.0552C7.66826 10.0552 8.11013 10.0167 8.53881 9.94434" stroke="#F5A623" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: "#F5A623",
      accentColor: "#101827",
      docsUrl: "https://polar.sh/docs",
      whyWeChose: "Creating sustainable funding models for open source projects is challenging, but Polar.sh makes it simple with a complete platform for monetization. Unlike traditional funding platforms, Polar integrates directly with GitHub repositories and issues, allowing maintainers to receive funding for specific features or bug fixes. Its subscription tiers enable building recurring revenue streams with minimal setup, while the issue bounty system helps prioritize development based on user needs. As advocates for open source sustainability, we've integrated Polar to create transparency around our development roadmap and give users a direct way to support features they care about."
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  // Handle tab click with accessibility support
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };
  
  return (
    <section 
      id="features" 
      className="relative py-24 bg-[#0a0c14] overflow-hidden"
      ref={sectionRef}
    >
      {/* Modern gradient background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 blur-[120px]"></div>
        
        {/* Animated subtle gradients */}
       
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxODE4MTgiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMzBjMCAxNi41NjktMTMuNDMxIDMwLTMwIDMwQzEzLjQzMSA2MCAwIDQ2LjU2OSAwIDMwIDAgMTMuNDMxIDEzLjQzMSAwIDMwIDAgNDYuNTY5IDAgNjAgMTMuNDMxIDYwIDMweiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9Ii41Ii8+PHBhdGggZD0iTTYwIDMwYzAgMTYuNTY5LTEzLjQzMSAzMC0zMCAzMEM0NC45MzcgNjAgMzAgNDUuMDYzIDMwIDMwUzQ0LjkzNyAwIDMwIDBjMTYuNTY5IDAgMzAgMTMuNDMxIDMwIDMweiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-gradient-to-r from-white/10 to-white/5 rounded-full px-5 py-2 mb-6 backdrop-blur-sm border border-white/10">
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-medium text-white tracking-wider">POWERFUL TECH STACK</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-emerald-400 leading-tight max-w-4xl mx-auto">
            Everything You Need, Nothing You Don&apos;t
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Skip the boilerplate and focus on your core product with our complete, production-ready tech stack.
          </p>
        </motion.div>
        
        {/* Horizontal Tab Navigation */}
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="mb-10"
        >
          <div 
            className="flex flex-wrap justify-center items-center gap-3 md:gap-2 pb-1 overflow-x-auto"
            role="tablist"
            aria-label="Feature tabs"
          >
            {features.map((feature, index) => (
              <button
                key={`tab-${index}`}
                role="tab"
                id={`tab-${index}`}
                aria-selected={activeTab === index}
                aria-controls={`tabpanel-${index}`}
                className={`
                  relative px-4 py-2.5 md:px-6 md:py-3 rounded-full 
                  text-sm md:text-base font-medium
                  transition-all duration-300
                  flex items-center gap-2.5
                  outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0c14] focus:ring-emerald-500/50
                  ${activeTab === index 
                    ? `bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-900/30` 
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}
                `}
                onClick={() => handleTabClick(index)}
                style={{
                  boxShadow: activeTab === index ? `0 0 20px rgba(${feature.color}, 0.3)` : ''
                }}
              >
                <span className={`
                  w-5 h-5 flex-shrink-0 rounded-full
                  ${activeTab === index ? 'bg-white/20' : 'bg-white/10'}
                  flex items-center justify-center
                `}>
                  {feature.icon}
                </span>
                <span className="truncate">{feature.title}</span>
              </button>
            ))}
          </div>

          {/* Bottom scroll indicator for mobile */}
          <div className="md:hidden flex justify-center mt-2">
            <div className="h-1 w-10 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-emerald-500 rounded-full animate-scroll-indicator"></div>
            </div>
          </div>
        </motion.div>
        
        {/* Tab Content Area */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#1a1c25] to-[#0d0f18] backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {features.map((feature, index) => (
              activeTab === index && (
                <motion.div
                  key={`content-${index}`}
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  id={`tabpanel-${index}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${index}`}
                  className="p-6 md:p-8"
                >
                  {/* Content Top Bar */}
                  <div 
                    className="h-1 w-full -mt-6 md:-mt-8 mb-6 md:mb-8" 
                    style={{ background: `linear-gradient(to right, ${feature.color}, transparent)` }}
                  ></div>
                  
                  {/* Feature Details Section - Now always visible */}
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center">
                      <span>Why We Chose {feature.title}</span>
                      <a 
                        href={feature.docsUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto flex-shrink-0 inline-flex items-center text-emerald-300 hover:text-emerald-200 transition-colors duration-200"
                      >
                        <span className="mr-2">Documentation</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </h3>
                    <div className="bg-white/5 rounded-lg p-6 border border-white/5">
                      <p className="text-gray-300 leading-relaxed">
                        {feature.whyWeChose}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
        
        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <a 
            href="#" 
            className="group inline-flex items-center bg-transparent border-2 border-[#10b981] hover:border-[#a7f3d0] text-white hover:text-white px-6 py-3 rounded-full text-base font-medium transition-all duration-300 shadow-lg shadow-[#10b981]/20 hover:shadow-[#10b981]/40 hover:-translate-y-0.5"
          >
            <span>Explore All Features</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Add keyframe animation for scroll indicator */}
      <style jsx global>{`
        @keyframes scrollIndicator {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-slower {
          animation: pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-scroll-indicator {
          animation: scrollIndicator 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
} 