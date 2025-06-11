import Link from "next/link";

export default function Error({}) {
  return (
    <div className="flex content-center items-center px-10 w-full h-screen sm:px-24 md:px-16 lg:px-24">
      <div className="flex flex-col gap-4 mx-auto max-w-max">
        <h1 className="mx-auto text-lg font-medium text-center text-neutral-300">That Content Doesn&apos;t Exist</h1>
        <h1 className="mx-auto text-center text-neutral-400 text-md">
          That page does not exist. It must have been moved or deleted. Please refresh if you think that is not the case
        </h1>
        <Link
          href="/"
          className={`mx-auto mt-3  w-max px-8 py-3 rounded-none text-xs font-medium ${
            1 == 1 ? "bg-primary-300 text-black" : "bg-white text-white"
          }`}
        >
          Return Back
        </Link>
      </div>
    </div>
  );
}
