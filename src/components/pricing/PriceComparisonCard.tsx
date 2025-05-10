"use client";

/**
 * PriceComparisonCard Component
 * 
 * A minimalistic interactive card component that shows savings between subscription pricing and one-time payment.
 */

import { useState, useEffect } from "react";

export interface PriceComparisonCardProps {
  className?: string;
}

// Custom animated counter component
function AnimatedCounter({ value, prefix = "", className = "" }: { value: number, prefix?: string, className?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    // Animate the number changing
    const start = displayValue;
    const end = value;
    const duration = 500; // ms
    const startTime = performance.now();
    
    const animateValue = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuad = progress * (2 - progress);
      const current = Math.round(start + (end - start) * easeOutQuad);
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };
    
    requestAnimationFrame(animateValue);
  }, [value, displayValue]);
  
  return <span className={className}>{prefix}{displayValue.toLocaleString()}</span>;
}

export default function PriceComparisonCard({ className = "" }: PriceComparisonCardProps) {
  // Pricing data for comparison
  const subscriptionData = {
    proMonthly: 24,
    proAnnual: 229,
    monthsToBreakEven: 6, // $129 ÷ $24 = ~5.4 months
    lifetimePrice: 129,
    originalLifetimePrice: 229
  };

  // Interactive state
  const [timeInMonths, setTimeInMonths] = useState(36); // Default to 3 years
  const [yearsLabel, setYearsLabel] = useState("3 years");
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [isHovering, setIsHovering] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<'monthly' | 'annual'>('monthly');

  // Calculate savings based on chosen time period
  const monthlyCost = subscriptionData.proMonthly * timeInMonths;
  const annualCost = subscriptionData.proAnnual * (timeInMonths / 12);
  
  // Use the selected comparison mode
  const subscriptionCost = comparisonMode === 'monthly' ? monthlyCost : Math.round(annualCost);
  const savings = subscriptionCost - subscriptionData.lifetimePrice;

  // Calculate progress to break-even point
  const breakEvenProgress = Math.min(100, (timeInMonths / subscriptionData.monthsToBreakEven) * 100);
  
  // Update years label when timeInMonths changes
  useEffect(() => {
    const years = timeInMonths / 12;
    if (years === 1) {
      setYearsLabel("1 year");
    } else if (Number.isInteger(years)) {
      setYearsLabel(`${years} years`);
    } else {
      const months = timeInMonths % 12;
      if (months === 0) {
        setYearsLabel(`${Math.floor(years)} years`);
      } else if (Math.floor(years) === 0) {
        setYearsLabel(`${months} months`);
      } else {
        setYearsLabel(`${Math.floor(years)} years, ${months} months`);
      }
    }
  }, [timeInMonths]);

  return (
    <div 
      className={`bg-[#0a0c14] rounded-xl shadow-lg p-8 border border-gray-800 transition-all duration-300 hover:border-[#10b981]/40 hover:shadow-xl ${className} relative w-full max-w-sm mx-auto overflow-hidden hover:-translate-y-1`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 to-[#a7f3d0]/5"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:16px_16px]"></div>
      
      <div className="relative">
        <h2 className="text-2xl font-bold text-white mb-1">Price Comparison</h2>
        <p className="text-sm text-gray-400 mb-5">Pay once, save hundreds over time</p>
        
        <div className="flex flex-col space-y-4">
          {/* First row: Comparison mode toggle and time period */}
          <div className="flex justify-between items-center gap-3">
            {/* Comparison mode toggle */}
            <div>
              <div className="bg-[#111827] p-1 rounded-full inline-flex shadow-sm border border-gray-800">
                <button
                  onClick={() => setComparisonMode('monthly')}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${
                    comparisonMode === 'monthly'
                      ? 'bg-transparent border-2 border-[#10b981] text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setComparisonMode('annual')}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${
                    comparisonMode === 'annual'
                      ? 'bg-transparent border-2 border-[#10b981] text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Annual
                </button>
              </div>
            </div>

            {/* Quick select buttons */}
            <div className="flex gap-2">
              {[
                { label: "1y", months: 12 },
                { label: "3y", months: 36 },
                { label: "5y", months: 60 },
              ].map((option) => (
                <button
                  key={option.label}
                  onClick={() => setTimeInMonths(option.months)}
                  className={`text-sm px-3 py-1 rounded-full transition-all ${
                    timeInMonths === option.months
                      ? "bg-transparent border-2 border-[#10b981] text-white shadow-lg"
                      : "bg-[#111827] text-gray-400 hover:text-white hover:bg-[#1a2235]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Years display */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-base text-gray-300">
                <span className="text-[#10b981] font-semibold">{yearsLabel}</span>
              </span>
              <span className="text-sm text-gray-400">
                {timeInMonths} months
              </span>
            </div>
            
            <input
              id="time-slider"
              type="range"
              min="1"
              max="120"
              step="1"
              value={timeInMonths}
              onChange={(e) => setTimeInMonths(parseInt(e.target.value))}
              className="w-full h-2 bg-[#111827] rounded-lg appearance-none cursor-pointer accent-[#10b981]"
            />
          </div>

          {/* Break-even progress bar */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-base text-gray-400">Break-even point</span>
              <span className="text-base font-medium text-[#10b981]">
                {breakEvenProgress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-[#111827] rounded-full h-2">
              <div 
                className="bg-[#10b981] h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${breakEvenProgress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Price comparison section */}
          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-400">
                {comparisonMode === 'monthly' ? 'Monthly' : 'Annual'} plan
              </span>
              <AnimatedCounter 
                value={subscriptionCost} 
                prefix="$" 
                className="text-lg font-semibold text-white"
              />
            </div>
            
            {/* One-time payment */}
            <div className="flex justify-between items-center py-3 border-t border-gray-800">
              <div>
                <span className="text-lg text-gray-400">Lifetime access</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-500 line-through">${subscriptionData.originalLifetimePrice}</span>
                  <span className="text-xs bg-[#2a2512] text-[#10b981] rounded-full px-2 py-0.5">
                    {Math.round((subscriptionData.originalLifetimePrice - subscriptionData.lifetimePrice) / subscriptionData.originalLifetimePrice * 100)}% off
                  </span>
                </div>
              </div>
              <span className="text-xl font-semibold text-[#10b981]">${subscriptionData.lifetimePrice}</span>
            </div>
          </div>
          
          {/* Savings box */}
          <div className={`p-4 rounded-lg border transition-all duration-300 ${
            savings > 0 
              ? "bg-[#122820]/50 border-[#10b981]/30" 
              : "bg-gray-800/30 border-gray-700"
          }`}>
            <div className="flex justify-between items-center">
              <span className={`text-lg font-medium ${savings > 0 ? "text-[#10b981]" : "text-gray-300"}`}>
                Your savings
              </span>
              <AnimatedCounter 
                value={savings > 0 ? savings : -Math.abs(savings)} 
                prefix={savings > 0 ? "$" : "-$"} 
                className={`text-2xl font-bold ${
                  savings > 0 
                    ? "text-[#10b981]" 
                    : "text-gray-300"
                }`}
              />
            </div>
            
            {savings > 0 && (
              <p className="text-sm text-gray-400 mt-1">
                That&apos;s <span className="text-[#10b981] font-medium">{Math.round((savings / subscriptionCost) * 100)}%</span> less than paying for a subscription over {yearsLabel}.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 