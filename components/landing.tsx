"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Landing() {
  return (
    <div className="pb-16 text-white bg-gradient-to-b to-black font-pops lg:pb-0 lg:h-screen lg:overflow-hidden from-primary-950">
      <div className="">
        <header className="flex justify-between items-center px-8 py-8 h-[96px] lg:px-16">
          <h1 className="text-xl font-medium md:text-2xl font-pops">Falar</h1>
          <nav>
            <Link
              href="/login"
              className="px-8 py-3 text-sm font-medium text-black bg-white rounded-none md:text-base font-pops"
            >
              Sign Up
            </Link>
          </nav>
        </header>

        
      <main className=" lg:h-[calc(100vh-96px)] text-white">
        <div className="flex flex-col gap-8 px-8 py-8 lg:grid lg:grid-cols-2 lg:px-16">
          <div className="flex flex-col flex-grow order-2 w-auto lg:order-1">
        <div className="text-left">
          <h1 className="mb-6 text-6xl font-semibold text-center lg:text-left md:text-7xl">
            Falar<span className="block mt-4 text-xl font-medium md:text-4xl"><br className="hidden lg:block"></br>The Modern Social Network <br></br>Template</span>
          </h1>
          <p className="mb-10 text-base text-center text-gray-400 lg:text-left md:text-lg">
            Falar is a next-generation social network template that includes both frontend and the backend.<br></br><br></br>Powered by NextJS and Supabase, Falar is your one stop solution for a powerful custom social network.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/login"
              className="px-10 py-3 text-lg font-medium text-center text-black rounded-none transition-all lg:text-left bg-primary-300 hover:bg-primary-600"
            >
              Sign Up
            </Link>
            <Link
              href="/documentation.pdf"
              className="px-10 py-3 text-lg font-medium text-center text-white rounded-none border border-green-700 transition-all lg:text-left hover:bg-green-800"
            >
              View Documentation
            </Link>
          </div>
        </div>
        </div>
        <div className="order-1 pb-16 lg:order-2 lg:pb-0">
          <img src="/landing.png" className="rounded-none border shadow-xl border-neutral-800"></img>
        </div>
        </div>
      </main>
      </div>
    </div>
  );
}
