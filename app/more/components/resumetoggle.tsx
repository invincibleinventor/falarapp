'use client'

import Link from "next/link"

export default function Toggle(props:any){
    return(
        <Link className="px-6 py-3 text-xs text-white bg-blue-500 rounded-full w-max" href={props.isresume?"/editresume":'/setupresume'}>{props.isresume?"Edit Resume":"Setup Resume"}</Link>
    )
}