"use client";

import RepositoryAccess from "@/components/repository/RepositoryAccess";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { motion } from "framer-motion";

export default function Dashboard() {
  const subscription = useSubscription();
  const plan = subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1); // Capitalize the plan name
  
  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-[#0F0F0F] min-h-screen p-6">
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-8 mb-10 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Developer Access</h1>
              <div className="text-sm opacity-80">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">
                  {!subscription.loading ? plan + " Plan" : "Loading..."}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-white/90 max-w-2xl mb-6">
            Welcome to your developer dashboard. You now have complete access to the source code repository
            and all developer resources for this project.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center text-sm">
              <svg className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              GitHub Repository
            </div>
            <div className="flex items-center text-sm">
              <svg className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Comprehensive Documentation
            </div>
            <div className="flex items-center text-sm">
              <svg className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
              Developer Tools &amp; Resources
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-5 -bottom-5 w-32 h-32 rounded-full bg-white/10"></div>
        <div className="absolute right-20 top-10 w-12 h-12 rounded-full bg-white/10"></div>
      </motion.div>
      
      {/* Main content with sections */}
      <div className="space-y-10">
        {/* Repository Access Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <RepositoryAccess 
            githubUrl="http://iamdrish.com/"
          />
        </motion.section>
        
        {/* Documentation Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Documentation
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive guides and resources to help you understand the codebase
            </p>
          </div>
          
          <div className="bg-white dark:bg-[#1B1B1B] rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a 
                href="http://iamdrish.com/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white">Quick Start Guide</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Get up and running quickly with our step-by-step setup guide
                </p>
              </a>
              
              <a 
                href="http://iamdrish.com/documentation" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white">Full Documentation</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Complete documentation for the entire project and its components
                </p>
              </a>
              
              <a 
                href="https://x.com/iam_drish" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white">Support &amp; FAQ</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Get help and find answers to commonly asked questions
                </p>
              </a>
            </div>
          </div>
        </motion.section>
        
        {/* Development Tools Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Development Tools
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Essential tools and resources for your development workflow
            </p>
          </div>
          
          <div className="bg-white dark:bg-[#1B1B1B] rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a 
                href="https://nextjs.org/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 0-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white">Next.js</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Full documentation for the Next.js framework
                </p>
              </a>
              
              <a 
                href="https://clerk.com/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white">Clerk</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Authentication service documentation and guides
                </p>
              </a>
              
              <a 
                href="https://supabase.com/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
                  </div>
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white">Supabase</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Database and backend services documentation
                </p>
              </a>
            </div>
          </div>
        </motion.section>
        
        {/* Additional Resources Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Community & Support
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with the community and get support for your project
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <a 
              href="https://x.com/iam_drish" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center p-6 bg-white dark:bg-[#1B1B1B] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-4">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-1">Twitter</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Follow me on Twitter for updates and announcements</p>
              </div>
            </a>
            
            <a 
              href="http://iamdrish.com/" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center p-6 bg-white dark:bg-[#1B1B1B] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mr-4">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-1">Website</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Visit my personal website for more information</p>
              </div>
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
} 