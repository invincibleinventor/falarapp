'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
interface pros {
    url?: any,
    name: string,
    link?: string,
}



export default function App (props:pros) {
    const loc = usePathname()
   let a = {'opened': false}

    if(loc==props.link){
        console.log(props.link)
        a.opened=true
    }
    else if(props.link=='/myself' && loc.startsWith('/profile')){
        a.opened=true
    }
    else{
        console.log('')
    }
    

    return(
        <Link href={props.link} className={`flex flex-row rounded-lg px-3 md:px-[6px] md:pr-8 w-max md:w-full py-[10px] mx-2 md:mx-0 md:space-x-[16px] rounded-lg transition-all ease-linear duration-100 cursor-pointer items-center content-center  ${a.opened?'':''}`}>
  <svg className={`w-[26px] stroke-2 p-[2px] text-black h-[26px] ${a.opened?'text-black':'text-gray-700'}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">{props.url}</svg>
    <span className={`text-gray-700 text-sm md:inline-block hidden font-poppins ${a.opened?'font-medium text-black':'font-normal'} pt-[0px]`}>{props.name}</span>
  </Link>
    )
}
