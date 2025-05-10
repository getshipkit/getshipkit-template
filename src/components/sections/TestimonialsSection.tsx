"use client";

import { useState, useEffect, useRef } from 'react';

export default function TestimonialsSection() {
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
        threshold: 0.2,
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
    <section id="testimonials" ref={sectionRef} className="py-28 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className={`text-center mb-16 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <span className="text-xs font-semibold tracking-widest text-emerald-500 uppercase">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight mt-2">Trusted by developers</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">See what professionals are saying about our solution.</p>
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 delay-200 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          {[
            {
              quote: "This SaaS boilerplate saved me weeks of development time. The code quality is exceptional and the support team is responsive.",
              author: "Sarah Johnson",
              role: "Frontend Developer"
            },
            {
              quote: "The authentication system works flawlessly, and the payment integration was surprisingly easy to customize to our specific needs.",
              author: "Michael Chen",
              role: "Full Stack Developer"
            },
            {
              quote: "Clean architecture, great documentation, and excellent support. Exactly what our startup needed to launch quickly.",
              author: "Emily Rodriguez",
              role: "CTO at StartupX"
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-[#111]/30 border border-gray-200 dark:border-gray-800 p-8 rounded-2xl transition-all duration-300 hover:border-emerald-500/30 hover:-translate-y-1 shadow-sm dark:shadow-none">
              <div className="flex mb-4 text-emerald-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">&quot;{testimonial.quote}&quot;</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 font-bold mr-3">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 