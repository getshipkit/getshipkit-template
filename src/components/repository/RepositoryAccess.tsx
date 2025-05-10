"use client";

import { useSubscription } from '@/lib/hooks/useSubscription';

export type RepositoryAccessProps = {
  githubUrl?: string;
};

export default function RepositoryAccess({
  githubUrl = "https://github.com/yourusername/saas-boilerplate"
}: RepositoryAccessProps) {
  const subscription = useSubscription();
  
  // Check if user has an active subscription
  const hasActiveSubscription = !subscription.loading && 
    ['active', 'ending', 'trial', 'past_due'].includes(subscription.status);
  
  if (subscription.loading) {
    return (
      <div className="bg-white dark:bg-[#0F0F0F] rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-800 animate-pulse">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-800"></div>
        </div>
        <div className="h-6 w-48 mx-auto bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
        <div className="h-12 w-48 mx-auto rounded-xl bg-gray-200 dark:bg-gray-800"></div>
      </div>
    );
  }
  
  if (!hasActiveSubscription) {
    return null; // Don't show anything if no subscription
  }
  
  return (
    <div className="bg-white dark:bg-[#0F0F0F] rounded-2xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
      <div className="flex justify-center mb-6">
        <svg className="w-20 h-20 text-gray-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </div>
      
      <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Source Code Repository</h2>
      <p className="text-gray-600 dark:text-gray-400 text-base mb-6 max-w-lg mx-auto">
        Access the complete source code on GitHub to clone, fork, and stay updated with the latest improvements.
      </p>
      
      <a 
        href={githubUrl}
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white font-medium hover:from-black hover:to-gray-800 transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-gray-900/40 hover:-translate-y-1"
      >
        <span>View on GitHub</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </a>
    </div>
  );
} 