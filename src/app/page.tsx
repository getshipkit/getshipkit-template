"use client";

import { Navbar, Footer } from "@/components/layout";
import dynamic from 'next/dynamic';
import { useState, useEffect, Suspense } from "react";
import LoadingComponent from "@/components/ui/LoadingComponent";

// Lazy load all sections to reduce initial bundle size
const HeroSection = dynamic(() => import('@/components/sections/HeroSection'), {
  loading: () => <LoadingComponent />,
  ssr: true
});

const FeaturesSection = dynamic(() => import('@/components/sections/FeaturesSection'), {
  loading: () => <LoadingComponent />,
  ssr: false
});

const DesignedForSection = dynamic(() => import('@/components/sections/DesignedForSection'), {
  loading: () => <LoadingComponent />,
  ssr: false
});

const HowItHelpsSection = dynamic(() => import('@/components/sections/HowItHelpsSection'), {
  loading: () => <LoadingComponent />,
  ssr: false
});

const PricingSection = dynamic(() => import('@/components/sections/PricingSection'), {
  loading: () => <LoadingComponent />,
  ssr: false
});

const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'), {
  loading: () => <LoadingComponent />,
  ssr: false
});

const FAQSection = dynamic(() => import('@/components/sections/FAQSection'), {
  loading: () => <LoadingComponent />,
  ssr: false
});

const CTASection = dynamic(() => import('@/components/sections/CTASection'), {
  loading: () => <LoadingComponent />,
  ssr: false
});

// Define the star type
interface Star {
  top: string;
  left: string;
  width: string;
  height: string;
  opacity: string;
}

export default function Home() {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [isVisible, setIsVisible] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [annualBilling, setAnnualBilling] = useState(true);
  
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Generate fewer stars to improve performance (reduced from 100 to 30)
    const starElements = Array(30).fill(0).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 2 + 1}px`,
      height: `${Math.random() * 2 + 1}px`,
      opacity: `${Math.random() * 0.2}`,
    }));
    
    setStars(starElements);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-200 relative overflow-hidden">
      {/* Simplified star background with reduced elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none dark:block hidden">
        {stars.map((star, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              top: star.top,
              left: star.left,
              width: star.width,
              height: star.height,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>
      
      {/* Reduced gradient orbs - simplified for better performance */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl"></div>
      
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section (with priority) */}
        <Suspense fallback={<LoadingComponent />}>
          <HeroSection />
        </Suspense>
        
        {/* Sections loaded progressively as user scrolls */}
        <Suspense fallback={<LoadingComponent />}>
          <FeaturesSection />
        </Suspense>
        
        <Suspense fallback={<LoadingComponent />}>
          <DesignedForSection />
        </Suspense>
        
        <Suspense fallback={<LoadingComponent />}>
          <HowItHelpsSection />
        </Suspense>
        
        <Suspense fallback={<LoadingComponent />}>
          <PricingSection />
        </Suspense>
        
        <Suspense fallback={<LoadingComponent />}>
          <TestimonialsSection />
        </Suspense>
        
        <Suspense fallback={<LoadingComponent />}>
          <FAQSection />
        </Suspense>
        
        <Suspense fallback={<LoadingComponent />}>
          <CTASection />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}
