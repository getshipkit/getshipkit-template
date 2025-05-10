"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HowItHelpsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
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

  // Auto-advance the active step
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setActiveStep(prev => prev < 3 ? prev + 1 : 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isVisible]);

  const workflowSteps = [
    {
      id: 1,
      title: "Traditional Development",
      time: "Weeks to Months",
      stages: [
        { name: "Setup", percentage: 20, color: "#E57373" },
        { name: "Auth", percentage: 15, color: "#F06292" },
        { name: "Database", percentage: 20, color: "#9575CD" },
        { name: "UI Components", percentage: 20, color: "#4FC3F7" },
        { name: "Core Features", percentage: 25, color: "#81C784" },
      ]
    },
    {
      id: 2,
      title: "With Our Boilerplate",
      time: "Days to Weeks", 
      stages: [
        { name: "Setup", percentage: 5, color: "#E57373" },
        { name: "Auth", percentage: 2, color: "#F06292" },
        { name: "Database", percentage: 3, color: "#9575CD" },
        { name: "UI Components", percentage: 10, color: "#4FC3F7" },
        { name: "Core Features", percentage: 80, color: "#81C784" },
      ]
    }
  ];

  const developmentSteps = [
    {
      number: 1,
      title: "Clone & Configure",
      terminal: "git clone https://github.com/your-org/boilerplate.git my-app",
      description: "Start building immediately with our pre-configured setup. Everything you need is ready to go."
    },
    {
      number: 2,
      title: "Build Core Features",
      terminal: "npm run dev",
      description: "Focus on what makes your product unique while we handle the infrastructure."
    },
    {
      number: 3,
      title: "Launch & Scale",
      terminal: "git push vercel main",
      description: "Deploy to production in minutes. Scale to millions of users without changing your architecture."
    }
  ];

  return (
    <section 
      id="how-it-helps" 
      className="relative py-24 bg-[#0a0c14] overflow-hidden"
      ref={sectionRef}
    >
      {/* 3D-like background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-[50%] -left-[10%] w-[60%] h-[100%] rotate-12 bg-[#FFD700]/10 rounded-[40px]"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[40%] h-[80%] -rotate-12 bg-[#FFD700]/10 rounded-[40px]"></div>
        </div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-[#FFD700] rounded-full filter blur-[120px] opacity-20"></div>
          <div className="absolute bottom-[5%] right-[10%] w-72 h-72 bg-[#FFD700] rounded-full filter blur-[100px] opacity-20"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title with Split Design */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="inline-flex items-center bg-[rgba(255,255,255,0.1)] rounded-full px-4 py-2 mb-4 backdrop-blur-sm border border-white/10">
              <div className="w-2 h-2 bg-[#FFD700] rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-medium text-white tracking-wider">SUPERCHARGED WORKFLOW</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-br from-[#FFF6B7] via-[#FFD700] to-[#936A15] leading-tight">
              Accelerate Your <br className="md:hidden" />Development Cycle
            </h2>
          </div>
          <div className="md:w-1/2 md:text-right">
            <p className="text-xl text-gray-300 max-w-xl md:ml-auto">
              Focus on building what matters. Our boilerplate eliminates the tedious setup and configuration so you can create value from day one.
            </p>
          </div>
        </div>
        
        {/* Time Comparison Visualization */}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 p-8 overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-[#101827] px-4 py-2 rounded-bl-lg rounded-tr-lg backdrop-blur-sm">
              <span className="text-white text-sm font-medium">Time Allocation Comparison</span>
            </div>
            
            <div className="space-y-10 py-6">
              {workflowSteps.map((workflow) => (
                <div key={workflow.id} className="relative">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">{workflow.title}</h3>
                    <span className="text-white font-medium">{workflow.time}</span>
                  </div>
                  
                  <div className="h-16 flex rounded-lg overflow-hidden">
                    {workflow.stages.map((stage, index) => (
                      <motion.div
                        key={stage.name}
                        className="h-full flex items-center justify-center"
                        style={{
                          backgroundColor: stage.color,
                          width: `${stage.percentage}%`
                        }}
                        initial={{ width: 0 }}
                        animate={isVisible ? { width: `${stage.percentage}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: index * 0.1 + (workflow.id * 0.3) }}
                      >
                        <span className={`text-xs font-medium ${stage.percentage < 10 ? 'hidden' : ''} text-black`}>
                          {stage.name} {stage.percentage}%
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-2 flex">
                    {workflow.stages.map((stage) => (
                      <div key={stage.name} className="flex items-center mr-4" style={{ width: stage.percentage < 10 ? 'auto' : 'auto' }}>
                        {stage.percentage < 10 && (
                          <>
                            <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: stage.color }}></div>
                            <span className="text-xs text-gray-400">{stage.name} {stage.percentage}%</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Interactive Terminal Steps */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="mb-10 text-center">
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                className="text-2xl font-bold text-white"
              >
                Three Steps to Production
              </motion.h3>
           </div>
            
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
             transition={{ duration: 0.6, delay: 0.3 }}
             className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
           >
             <div className="flex flex-col md:flex-row">
               {/* Tabs on the left */}
               <div className="w-full md:w-1/3 border-r border-white/10">
                 {developmentSteps.map((step) => (
                   <div 
                     key={step.number}
                     onClick={() => setActiveStep(step.number)}
                     className={`p-6 cursor-pointer transition-all duration-300 border-l-4 ${
                       activeStep === step.number 
                         ? 'border-l-[#FFD700] bg-white/5' 
                         : 'border-l-transparent hover:bg-white/5'
                     }`}
                   >
                     <div className="flex items-center">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                         activeStep >= step.number 
                           ? 'bg-[#FFD700] text-black' 
                           : 'bg-black/50 border border-gray-700 text-gray-500'
                       }`}>
                         <span className="font-bold">{step.number}</span>
                       </div>
                       <div>
                         <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
               
               {/* Terminal on the right */}
               <div className="w-full md:w-2/3 p-6">
                 {/* Terminal Window */}
                 <div className="bg-[#0a0c14] rounded-md overflow-hidden border border-white/10">
                   <div className="bg-[#101827] px-4 py-2 flex items-center gap-1">
                     <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                     <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                     <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                     <div className="ml-2 text-xs text-gray-400">terminal</div>
                   </div>
                   
                   <motion.div 
                     key={activeStep}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ duration: 0.3 }}
                     className="p-4 font-mono text-sm overflow-x-auto min-h-[200px]"
                   >
                     {/* Previous commands (greyed out) */}
                     {activeStep > 1 && developmentSteps.slice(0, activeStep-1).map((prevStep) => (
                       <div key={prevStep.number} className="flex items-start mb-3 text-gray-500">
                         <span className="mr-2">$</span>
                         <span>{prevStep.terminal}</span>
                       </div>
                     ))}
                     
                     {/* Current command (highlighted) */}
                     <div className="flex items-start mb-1">
                       <span className="text-[#FFD700] mr-2">$</span>
                       <span className="text-white">
                         {developmentSteps[activeStep-1]?.terminal}
                       </span>
                     </div>
                     
                     {/* Blinking cursor */}
                     <div className="h-4 mt-1 w-3 bg-[#FFD700]/70 animate-pulse"></div>
                   </motion.div>
                 </div>
               </div>
             </div>
           </motion.div>
         </div>
        
        {/* CTA */}
        <div className="mt-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="relative inline-block"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 blur-xl bg-[#FFD700]/30 rounded-full"></div>
            
            <div className="relative inline-block p-0.5 rounded-full bg-gradient-to-br from-[#FFF6B7] via-[#FFD700] to-[#936A15]">
              <a 
                href="#" 
                className="inline-flex items-center px-8 py-4 rounded-full bg-[#0a0c14] text-[#FFD700] hover:bg-[#0a0c14]/80 transition-all duration-300 text-lg font-medium"
              >
                Start Building Today
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 