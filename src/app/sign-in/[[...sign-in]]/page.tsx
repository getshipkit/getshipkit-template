"use client";

import React, { useEffect } from 'react';
import { SignIn, useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  useEffect(() => {
    // If user is already signed in and there's a redirect parameter, redirect them
    if (isSignedIn && redirectUrl) {
      router.push(redirectUrl);
    } else if (isSignedIn) {
      // If signed in but no specific redirect, go to billing page
      router.push('/dashboard/billing');
    }
  }, [isSignedIn, redirectUrl, router]);

  return (
    <div className="flex min-h-screen bg-[#1A1A1A]">
      <div className="flex flex-col items-center justify-center w-full p-4">
        <div className="w-full max-w-md relative">
          <div className="absolute inset-0 bg-white/10 blur-xl rounded-full -z-10 opacity-30"></div>
          <SignIn redirectUrl={redirectUrl || '/dashboard/billing'} />
        </div>
      </div>
    </div>
  );
} 