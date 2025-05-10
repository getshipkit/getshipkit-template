"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

type FeedbackType = 'bug' | 'feature' | 'general';

export default function FeedbackPage() {
  const { user, isLoaded } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<FeedbackType>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Define a proper Feedback interface
  interface Feedback {
    id: string;
    title: string;
    description: string;
    type: FeedbackType;
    created_at: string;
    status: string;
    user_id: string;
  }
  
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  
  // Fetch user's feedback history
  useEffect(() => {
    if (isLoaded && user) {
      const fetchFeedback = async () => {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching feedback:', error);
        } else if (data) {
          setFeedbackList(data);
        }
      };
      
      fetchFeedback();
    }
  }, [isLoaded, user, submissionStatus]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded || !user) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('feedback').insert({
        title,
        description,
        type,
        user_id: user.id,
        user_email: user.primaryEmailAddress?.emailAddress,
      });
      
      if (error) {
        console.error('Error submitting feedback:', error);
        setSubmissionStatus('error');
      } else {
        setSubmissionStatus('success');
        // Reset form
        setTitle('');
        setDescription('');
        setType('general');
        // Reset status after 3 seconds
        setTimeout(() => setSubmissionStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white dark:bg-[#0F0F0F]">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Send Feedback</h2>
        <p className="text-gray-600 dark:text-[#A0A0A0]">Share your thoughts, report bugs, or request new features</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feedback Form */}
        <div className="bg-white dark:bg-[#1B1B1B] rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Submit New Feedback</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="type" className="block text-gray-600 dark:text-[#A0A0A0] text-sm font-medium mb-2">
                Feedback Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as FeedbackType)}
                className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                required
              >
                <option value="general">General Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-600 dark:text-[#A0A0A0] text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                placeholder="Brief title of your feedback"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-600 dark:text-[#A0A0A0] text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 min-h-32"
                placeholder="Please provide details..."
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg flex items-center justify-center font-medium transition-all duration-200 ${
                isSubmitting 
                  ? 'bg-emerald-600/50 text-white/70 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white hover:from-emerald-400 hover:to-emerald-300 shadow-lg shadow-emerald-500/20'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : 'Submit Feedback'}
            </button>
            
            {submissionStatus === 'success' && (
              <div className="mt-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-700 dark:text-emerald-500 rounded-lg p-3 text-sm">
                Thank you for your feedback! It has been submitted successfully.
              </div>
            )}
            
            {submissionStatus === 'error' && (
              <div className="mt-4 bg-red-500/20 border border-red-500/50 text-red-700 dark:text-red-500 rounded-lg p-3 text-sm">
                There was an error submitting your feedback. Please try again.
              </div>
            )}
          </form>
        </div>
        
        {/* Feedback History */}
        <div className="bg-white dark:bg-[#1B1B1B] rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Your Previous Feedback</h3>
          
          {feedbackList.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {feedbackList.map((feedback) => (
                <div 
                  key={feedback.id} 
                  className="bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{feedback.title}</h4>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      feedback.type === 'bug' ? 'bg-red-500/20 text-red-700 dark:text-red-400' :
                      feedback.type === 'feature' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                      'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-[#A0A0A0] text-sm mb-3 line-clamp-2">{feedback.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-[#666666]">
                    <span className={`px-2 py-1 rounded-full ${
                      feedback.status === 'open' ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                      feedback.status === 'in_progress' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400' :
                      feedback.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' :
                      'bg-gray-500/10 text-gray-700 dark:text-gray-400'
                    }`}>
                      {feedback.status.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                    <span>
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-[#252525] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-[#666666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-[#A0A0A0] mb-2">No feedback submitted yet</p>
              <p className="text-gray-500 dark:text-[#666666] text-sm">Your feedback history will appear here</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #252525;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4d4d4;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c4c4c4;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444444;
        }
      `}</style>
    </div>
  );
} 