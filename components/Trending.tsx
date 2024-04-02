'use client';
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { useEffect, useState } from "react"
export default function Trending(){
    const supabase = createClient()
    const date = new Date().toLocaleDateString('en-IN')
    const hour = new Date().getHours()
    const [a,setA] = useState<any>({})
    let h:any;
                    if(hour>=0 && hour<3){
                     h=0
                    }
                    else if(hour>=3 && hour<6){
                      h=3
                     }
                     else if(hour>=6 && hour<9){
                      h=6
                     }
                     else if(hour>=9 && hour<12){
                      h=9
                     }
                     else if(hour>=12 && hour<15){
                      h=12
                     }
                     else if(hour>=15 && hour<18){
                      h=15
                     }
                     else if(hour>=18 && hour<21){
                      h=18
                     }
                     else{
                      h=21
                     }
                     console.log(h)
                     useEffect(()=>{
                        async function fetch(){
    const {data,error} = await supabase.from('trending').select(h.toString()).eq('date',date)
    if(data && data.length>0){
       let j:any = data[0][h];
       console.log(j)
        const sortedArray = Object.entries(j).sort(([, valueA] : [any,any], [, valueB] :[any,any]) => valueB - valueA);
        j = Object.fromEntries(sortedArray);       
         j = Object.fromEntries(
            Object.entries(j).slice(0, 5)
        )
        setA(j)
        console.log(j)
        console.log(a)
        
      
        
    }
    else{
        if(error){
        console.log(error)
    
            }
            }
        }
        fetch()
        },[])
    
    return(
        <div className="flex flex-col w-full h-full py-2 space-y-0 text-gray-300 border rounded-lg bg-gray-900/30">
                 { Object.entries(a).map((t:any,k:any) : React.ReactNode => (<Link key={k} href={'/hashtag/'+t[0]} className="flex flex-row items-center content-center w-full p-4 px-6 py-4"><h1 className="text-sm font-semibold">#{t[0]}</h1><h1 className="ml-auto text-xs font-medium text-gray-300">{t[1]} {t[1]>1?"Posts":"Post"}</h1></Link>)) }          

        </div>
    )
}