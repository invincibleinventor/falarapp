
'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Landing() {
  return (
    <div className="min-h-screen text-white bg-gradient-to-b to-black from-primary-950">
      <div className="container px-6 py-8 mx-auto lg:py-16">
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-xl font-medium md:text-2xl font-pops">Falar</h1>
          <nav>
            <Link href="/login" className="px-8 py-3 text-sm font-medium text-black bg-white rounded-full md:text-base font-pops">
              Sign Up
            </Link>
          </nav>
        </header>
        
        <main className="flex flex-col justify-between items-center md:flex-row">
         <h1 className='mx-10 text-lg text-center md:mx-auto text-neutral-500 font-pops'>Home page is under construction. Kindly login to continue</h1>
        </main>
      </div>
    </div>
  );
}
