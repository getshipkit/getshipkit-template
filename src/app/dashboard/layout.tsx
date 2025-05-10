"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SubscriptionGuard } from "@/components/subscription";
import { ThemeToggle } from "@/components/ui";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Initial check
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Close sidebar on mobile when navigating to a new page
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);
  
  return (
    <SubscriptionGuard>
      <div className="min-h-screen flex bg-gray-50 dark:bg-[#0F0F0F] text-gray-600 dark:text-gray-400">
        {/* Overlay for mobile */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-30 transition-opacity duration-300" 
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      
        {/* Sidebar */}
        <div 
          className={`
            ${sidebarOpen ? 'w-72 translate-x-0' : 'w-20 lg:translate-x-0 -translate-x-full'} 
            bg-white dark:bg-[#0F0F0F]
            border-r border-gray-200 dark:border-gray-800 fixed h-full z-40
            transition-all duration-300 ease-in-out
            backdrop-blur-sm
          `}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-10">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              {sidebarOpen && (
                <div className="text-xl font-bold text-gray-900 dark:text-white tracking-tight transition-opacity duration-200">
                  GetShipKit
                </div>
              )}
            </div>
            
            {/* Theme Toggle - Moved to top */}
            <div className={`mb-6 flex ${sidebarOpen ? 'justify-between items-center' : 'justify-center'}`}>
              {sidebarOpen && <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>}
              <div className={`relative group ${!sidebarOpen && 'p-2 bg-gray-100/80 dark:bg-white/5 rounded-xl hover:bg-gray-200/80 dark:hover:bg-white/10 transition-colors duration-200'}`}>
                <ThemeToggle />
                
                {!sidebarOpen && (
                  <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-white dark:bg-[#0F0F0F] text-gray-900 dark:text-white text-sm
                    invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                    transition-all duration-300 border border-gray-200 dark:border-gray-800 shadow-xl z-50
                  ">
                    Toggle Theme
                  </div>
                )}
              </div>
            </div>
            
            <nav className="mt-2 flex-1">
              <div className="space-y-1.5">
                <div className={`${sidebarOpen ? 'pl-3 pb-2' : 'pl-0 pb-2'} text-xs font-medium text-gray-400 dark:text-white/30 uppercase tracking-wider transition-all duration-200`}>
                  {sidebarOpen ? 'Main Menu' : ''}
                </div>
                
                <Link 
                  href="/dashboard" 
                  className={`
                    flex items-center p-3 rounded-xl transition-all duration-200
                    hover:bg-gray-100 dark:hover:bg-white/5 relative group 
                    ${!sidebarOpen && 'justify-center'}
                    ${pathname === '/dashboard' 
                      ? 'bg-gradient-to-r from-emerald-500/10 to-transparent text-gray-900 dark:text-white border-l-2 border-emerald-500' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-l-2 border-transparent'}
                  `}
                >
                  <div className={`
                    ${pathname === '/dashboard' ? 'text-emerald-500' : 'text-gray-500 dark:text-gray-400 group-hover:text-emerald-500'}
                    transition-colors duration-200
                  `}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  
                  {sidebarOpen && <span className="ml-3 transition-opacity duration-200">Dashboard</span>}
                  
                  {!sidebarOpen && (
                    <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-white dark:bg-[#0F0F0F] text-gray-900 dark:text-white text-sm
                      invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                      transition-all duration-300 border border-gray-200 dark:border-gray-800 shadow-xl z-50
                    ">
                      Dashboard
                    </div>
                  )}
                </Link>
                
                <Link 
                  href="/dashboard/billing" 
                  className={`
                    flex items-center p-3 rounded-xl transition-all duration-200
                    hover:bg-gray-100 dark:hover:bg-white/5 relative group
                    ${!sidebarOpen && 'justify-center'}
                    ${pathname === '/dashboard/billing' 
                      ? 'bg-gradient-to-r from-emerald-500/10 to-transparent text-gray-900 dark:text-white border-l-2 border-emerald-500' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-l-2 border-transparent'}
                  `}
                >
                  <div className={`
                    ${pathname === '/dashboard/billing' ? 'text-emerald-500' : 'text-gray-500 dark:text-gray-400 group-hover:text-emerald-500'}
                    transition-colors duration-200
                  `}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  
                  {sidebarOpen && <span className="ml-3 transition-opacity duration-200">Billing</span>}
                  
                  {!sidebarOpen && (
                    <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-white dark:bg-[#0F0F0F] text-gray-900 dark:text-white text-sm
                      invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                      transition-all duration-300 border border-gray-200 dark:border-gray-800 shadow-xl z-50
                    ">
                      Billing
                    </div>
                  )}
                </Link>
                
                <Link 
                  href="/dashboard/feedback" 
                  className={`
                    flex items-center p-3 rounded-xl transition-all duration-200
                    hover:bg-gray-100 dark:hover:bg-white/5 relative group
                    ${!sidebarOpen && 'justify-center'}
                    ${pathname === '/dashboard/feedback' 
                      ? 'bg-gradient-to-r from-emerald-500/10 to-transparent text-gray-900 dark:text-white border-l-2 border-emerald-500' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-l-2 border-transparent'}
                  `}
                >
                  <div className={`
                    ${pathname === '/dashboard/feedback' ? 'text-emerald-500' : 'text-gray-500 dark:text-gray-400 group-hover:text-emerald-500'}
                    transition-colors duration-200
                  `}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  
                  {sidebarOpen && <span className="ml-3 transition-opacity duration-200">Feedback</span>}
                  
                  {!sidebarOpen && (
                    <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-white dark:bg-[#0F0F0F] text-gray-900 dark:text-white text-sm
                      invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                      transition-all duration-300 border border-gray-200 dark:border-gray-800 shadow-xl z-50
                    ">
                      Feedback
                    </div>
                  )}
                </Link>
              </div>
            </nav>
            
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="
                  w-full flex items-center justify-center p-3 
                  text-gray-600 dark:text-gray-400 bg-gray-100/80 dark:bg-white/5 rounded-xl 
                  hover:bg-gray-200/80 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white
                  transition-all duration-200 group
                "
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {sidebarOpen && <span className="ml-2">Collapse</span>}
              </button>
            </div>
          </div>
        </div>
      
        {/* Main Content */}
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'} ml-0`}>
          <header className="bg-white/80 dark:bg-[#0F0F0F]/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 py-4 px-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {isMobile && (
                  <button 
                    className="mr-4 p-2 rounded-lg bg-gray-100/80 dark:bg-white/5 hover:bg-gray-200/80 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                )}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pathname === '/dashboard' && 'Dashboard'}
                  {pathname === '/dashboard/billing' && 'Billing'}
                  {pathname === '/dashboard/feedback' && 'Feedback'}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {children}
          </main>
          
          <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 py-6 px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 dark:text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} GetShipKit. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SubscriptionGuard>
  );
} 