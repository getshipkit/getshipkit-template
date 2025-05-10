"use client";

// import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PricingCards } from '@/components/pricing';
import { isSubscriptionModel, isOneTimeModel } from '@/utils/paymentModel';

export default function PricingSection() {
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const { isSignedIn } = useAuth();
  const router = useRouter();
  
  const isSubscription = isSubscriptionModel();
  const isOneTime = isOneTimeModel();
  
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

  const handleUpgradeClick = (planType: string, period: 'monthly' | 'annual', productId: string) => {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const productKey = `${planType}_${period}`;
    setIsLoading({...isLoading, [planType]: true});
    
    if (isSignedIn) {
      // If user is already signed in, redirect directly to the Polar checkout
      window.location.href = `/api/checkout?productId=${productId}`;
    } else {
      // If not signed in, redirect to sign-in page with redirect parameter
      router.push(`/sign-in?redirect=/dashboard/billing`);
    }
  };
  
  const handleOneTimeUpgrade = (productId: string) => {
    setIsLoading({...isLoading, ['onetime']: true});
    
    if (isSignedIn) {
      // If user is already signed in, redirect directly to the Polar checkout
      window.location.href = `/api/checkout?productId=${productId}`;
    } else {
      // If not signed in, redirect to sign-in page with redirect parameter
      router.push(`/sign-in?redirect=/dashboard/billing`);
    }
  };

  return (
    <section 
      id="pricing" 
      className="relative py-24 bg-[#0a0c14] overflow-hidden"
      ref={sectionRef}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-[30%] left-[10%] w-72 h-72 bg-[#10b981] rounded-full filter blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[5%] w-64 h-64 bg-[#10b981]/30 rounded-full filter blur-[100px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center bg-[rgba(255,255,255,0.1)] rounded-full px-4 py-2 mb-4 backdrop-blur-sm border border-white/10"
          >
            <div className="w-2 h-2 bg-[#10b981] rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-medium text-white tracking-wider">SIMPLE PRICING</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#a7f3d0] to-[#10b981] leading-tight"
          >
            {isOneTime ? "One-Time Payment" : "Choose Your Perfect Plan"}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            {isOneTime
              ? "Get lifetime access with a single payment. No subscription required."
              : "Start with our free tier or upgrade for premium features to build your production-ready SaaS in record time."}
          </motion.p>
          
          {/* Pricing Toggle */}
          {isSubscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center mt-10 mb-14"
            >
              <div className="p-1 rounded-full bg-gradient-to-r from-[#10b981]/20 to-[#a7f3d0]/20 inline-flex backdrop-blur-sm border border-[#10b981]/10">
                <button
                  onClick={() => setPricingPeriod('monthly')}
                  className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all ${
                    pricingPeriod === 'monthly'
                      ? 'bg-transparent border-2 border-[#10b981] text-white shadow-lg shadow-[#10b981]/20'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setPricingPeriod('annual')}
                  className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all ${
                    pricingPeriod === 'annual'
                      ? 'bg-transparent border-2 border-[#10b981] text-white shadow-lg shadow-[#10b981]/20'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Annual <span className="bg-black/30 text-[#10b981] font-bold ml-1 px-1.5 py-0.5 rounded-full text-xs">Save 20%</span>
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Pricing Cards Component */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <PricingCards 
              showToggle={false} // We're handling the toggle above
              period={pricingPeriod}
              onPeriodChange={setPricingPeriod}
              defaultPeriod={pricingPeriod}
              isLoading={isLoading}
              buttonType="button"
              onUpgrade={handleUpgradeClick}
              onOneTimeUpgrade={handleOneTimeUpgrade}
            />
          </motion.div>
        </div>
        
        {/* Money-back guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-10"
        >
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#10b981]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>30-day money-back guarantee. No questions asked.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
} 