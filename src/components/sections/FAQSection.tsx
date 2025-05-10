"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  
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

  return (
    <section id="faq" className="py-28 px-4 bg-[#0a0c14] relative overflow-hidden" ref={sectionRef}>
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[20%] right-[15%] w-64 h-64 bg-[#10b981] rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-[30%] left-[10%] w-56 h-56 bg-[#10b981]/30 rounded-full filter blur-[120px]"></div>
      </div>
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Title and Description */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center bg-[rgba(255,255,255,0.1)] rounded-full px-4 py-2 mb-4 backdrop-blur-sm border border-white/10"
              >
                <div className="w-2 h-2 bg-[#10b981] rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm font-medium text-white tracking-wider">FAQ</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#a7f3d0] to-[#10b981] tracking-tight mt-2"
              >
                Frequently Asked Questions
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-gray-300 text-lg mb-8"
              >
                Everything you need to know about our platform.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8"
              >
                <p className="text-gray-400 mb-4">Still have questions?</p>
                <Link 
                  href="#"
                  className="inline-flex items-center bg-transparent border-2 border-[#10b981] hover:border-[#a7f3d0] text-white hover:text-white px-5 py-3 rounded-full font-medium transition-all duration-300 shadow-lg shadow-[#10b981]/20 hover:shadow-[#10b981]/40 hover:-translate-y-0.5"
                >
                  Contact our support team
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
          
          {/* Right Column - FAQs */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {[
                {
                  question: "What's included in the free trial?",
                  answer: "Our free trial includes all Pro plan features for 14 days. No credit card required until you decide to upgrade to a paid plan."
                },
                {
                  question: "Can I switch plans later?",
                  answer: "Yes, you can upgrade, downgrade, or cancel your subscription at any time. If you upgrade, the new rate will be prorated for the remainder of your billing cycle."
                },
                {
                  question: "How do I get support if I have questions?",
                  answer: "We offer 24/7 support via email for all customers. Additionally, Pro and Enterprise customers receive priority support and access to our dedicated support team."
                },
                {
                  question: "Is my data secure?",
                  answer: "Absolutely. We use industry-standard encryption for all data, both at rest and in transit. Our infrastructure is hosted on secure cloud providers with regular security audits."
                },
                {
                  question: "Can I export my data if I decide to leave?",
                  answer: "Yes, we provide simple data export tools that allow you to download all your data in standard formats at any time."
                },
                {
                  question: "Do you offer custom development?",
                  answer: "Enterprise customers can request custom development and integrations. Please contact our sales team to discuss your specific requirements."
                }
              ].map((faq, index) => (
                <div 
                  key={index}
                  className="border border-gray-800 hover:border-[#10b981]/30 rounded-xl overflow-hidden bg-[#111827]/80 backdrop-blur-sm transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-white text-lg">{faq.question}</span>
                    <svg 
                      className={`w-6 h-6 text-[#10b981] transform transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-5 text-gray-300">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 