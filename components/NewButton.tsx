'use client'
import { usePathname } from "next/navigation"
import Link from "next/link"
import QuickieMakerComponent from "./QuickieMakerComponent"
import { useState } from "react"
export default function Button(){
    const loc = usePathname()
    const [state,setState] = useState(false)
    return(
      <div className="">
        {state &&
        <div className="absolute w-screen z-[100000] flex items-center content-center top-0 bottom-0 h-screen bg-black/90">
          <div className="mx-auto">
          <QuickieMakerComponent stateChanger={setState}/>

          </div>
        </div>
        }
        
        {loc.includes('quickie')==false && loc.includes('hashtag')==false &&
        <Link href="/create" className="pt-5 ">
        <div className="mx-auto flex rounded-full md:mt-5 md:rounded-full h-[52px]  w-[52px] cursor-pointer  flex-row content-center items-center bg-cyan-800 p-3 transition-all duration-100 ease-linear hover:bg-cyan-600 md:mr-auto md:h-[44px] md:w-[calc(180px)] md:py-[14px]">
          <span className={`mx-auto hidden pt-[0px] text-center text-sm font-medium  text-white md:inline-block`}>
            New Post
          </span>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="m-auto h-[22px] w-[22px] text-white md:hidden"
            style={{ fill: "white" }}
          >
            <g>
              <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
            </g>
          </svg>
        </div>
      </Link>
}



        <button onClick={()=>setState(true)} className={`md:ml-0 md:pt-5 ml-[7px] ${loc.includes('quickie') || loc.includes('hashtag')?'':'hidden'}`}>
        <div className="mx-auto flex rounded-full md:rounded-full h-[52px]  w-[52px] cursor-pointer  flex-row content-center items-center bg-cyan-800 p-3 transition-all duration-100 ease-linear hover:bg-cyan-600 md:mr-auto md:h-[44px] md:w-[calc(180px)] md:py-[14px]">
          <span className={`mx-auto hidden pt-[0px] text-center text-sm font-medium  text-white md:inline-block`}>
            New Quickie
          </span>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="m-auto h-[22px] w-[22px] text-white md:hidden"
            style={{ fill: "white" }}
          >
            <g>
              <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
            </g>
          </svg>
        </div>
      </button>

      </div>
    )
}