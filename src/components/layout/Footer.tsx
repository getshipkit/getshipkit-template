"use client";

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { supabaseClient } from '@/lib/supabase-client';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Insert email into the email_list table
      const { error: insertError } = await supabaseClient
        .from('email_list')
        .insert([{ email }]);
      
      if (insertError) {
        if (insertError.code === '23505') { // Unique constraint violation
          setError('This email is already subscribed.');
        } else {
          setError('Failed to subscribe. Please try again.');
          console.error('Subscription error:', insertError);
        }
      } else {
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 3000);
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Testimonials', href: '#testimonials' },
        { name: 'FAQ', href: '#faq' },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: 'Documentation', href: '#' },
        { name: 'Tutorials', href: '#' },
        { name: 'Blog', href: '#' },
      ]
    },
    {
      title: "Company",
      links: [
        { name: 'About', href: '#' },
        { name: 'Contact', href: '#' },
        { name: 'Terms', href: '#' },
        { name: 'Privacy', href: '#' },
      ]
    },
  ];
  
  return (
    <footer className="bg-gray-100 dark:bg-[#0a0a0a] border-t border-gray-200/50 dark:border-gray-800/50 pt-16 pb-8">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                Get<span className="text-emerald-500">ShipKit</span>
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed pr-4">
              Launch your project quickly with GetShipKit&apos;s complete boilerplate. Authentication, payments, and user management - all set up for you.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'github', 'linkedin', 'facebook'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="w-9 h-9 rounded-full bg-gray-200 dark:bg-[#111] flex items-center justify-center text-gray-500 hover:bg-gray-300 dark:hover:bg-[#1a1a1a] hover:text-gray-700 dark:hover:text-white transition-colors duration-300"
                  aria-label={`Follow us on ${social}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {social === 'twitter' && (
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    )}
                    {social === 'github' && (
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    )}
                    {social === 'linkedin' && (
                      <path d="M19.7 3H4.3A1.3 1.3 0 003 4.3v15.4A1.3 1.3 0 004.3 21h15.4a1.3 1.3 0 001.3-1.3V4.3A1.3 1.3 0 0019.7 3zM8.339 17.67h-2.67V9.33h2.67v8.34zM7.004 8.16a1.548 1.548 0 110-3.095 1.548 1.548 0 010 3.096zM17.67 17.67H15v-4.363c0-2.67-3.005-2.467-3.005 0v4.364H9.333V9.33H12v1.301c1.295-2.404 5.67-2.58 5.67 2.304v4.734z" />
                    )}
                    {social === 'facebook' && (
                      <path fillRule="evenodd" clipRule="evenodd" d="M20 10.049C20 5.603 16.419 2 12 2C7.58 2 4 5.603 4 10.049C4 14.067 6.869 17.392 10.673 18V12.459H8.622V10.049H10.673V8.221C10.673 6.106 11.915 4.957 13.824 4.957C14.738 4.957 15.692 5.116 15.692 5.116V7.104H14.638C13.599 7.104 13.167 7.761 13.167 8.436V10.049H15.596L15.097 12.459H13.167V18C16.97 17.392 20 14.067 20 10.049Z" />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          {/* Navigation links */}
          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-gray-900 dark:text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      href={link.href} 
                      className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-500 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Newsletter and copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-6 md:mb-0 max-w-md">
              <h3 className="text-gray-900 dark:text-white font-semibold mb-3">Stay updated</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Subscribe to our newsletter to get the latest updates and news.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 focus:border-emerald-500 rounded-lg text-gray-900 dark:text-white text-sm outline-none transition-colors"
                    required
                  />
                  {subscribed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-emerald-600 rounded-lg text-white text-sm">
                      Thanks for subscribing!
                    </div>
                  )}
                  {error && (
                    <div className="text-red-500 text-xs mt-1">{error}</div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 px-5 py-2.5 rounded-lg text-white text-sm transition-all duration-300 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            </div>
            
            {/* New container for signature and copyright */}
            <div className="flex flex-col items-center md:items-end mt-12 md:mt-10">
              <div 
                className="text-center text-3xl text-gray-500 dark:text-gray-400" 
                style={{ fontFamily: "'Brush Script MT', cursive" }}
              >
                DrisH
              </div>
              <div className="text-gray-500 text-sm mt-2">
                &copy; {currentYear} GetShipKit. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 