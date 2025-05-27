
'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Landing() {
  return (
    <div className="min-h-screen text-white bg-black">
      <div className="container px-4 py-16 mx-auto">
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-medium font-pops">Falar</h1>
          <nav>
            <Link href="/login" className="px-8 py-3 font-medium text-black bg-white rounded-full font-pops">
              Sign Up
            </Link>
          </nav>
        </header>
        
        <main className="flex flex-col justify-between items-center md:flex-row">
         <h1 className='mx-auto text-lg text-neutral-500 font-pops'>Home page is under construction. Kindly login to continue</h1>
        </main>
      </div>
    </div>
  );
}