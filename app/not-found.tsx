"use client";
import Link from "next/link";

export default function Error({}) {
  return (
    <div className="flex items-center content-center w-full h-screen px-10 sm:px-24 md:px-16 lg:px-24">
      <div className="flex flex-col gap-4 mx-auto max-w-max">
        <h1 className="mx-auto text-lg font-medium text-center text-gray-300">That Content Doesn&apos;t Exist</h1>
        <h1 className="mx-auto text-center text-gray-500 text-md">
          That page does not exist. It must have been moved or deleted. Please refresh if you think that is not the case
        </h1>
        <Link
          href="/"
          className={`mx-auto mt-3  w-max px-8 py-3 rounded-full text-xs font-medium ${
            1 == 1 ? "bg-cyan-800 text-white" : "bg-white text-white"
          }`}
        >
          Return Back
        </Link>
      </div>
    </div>
  );
}
