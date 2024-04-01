import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import Link from "next/link"
export default async function Trending(){
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const date = new Date().toLocaleDateString('en-IN')
    const hour = new Date().getHours()
    let a:any={}
    let h;
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
    const {data,error} = await supabase.from('trending').select(h.toString()).eq('date',date)
    if(data && data.length>0){
        a = data[0][h];
        const sortedArray = Object.entries(a).sort(([, valueA] : [any,any], [, valueB] :[any,any]) => valueB - valueA);
        a = Object.fromEntries(sortedArray);       
         a = Object.fromEntries(
            Object.entries(a).slice(0, 5)
        )
        
      
        
    }
    else{
        if(error){
        console.log(error)
    
            }
            }
    
    return(
        <div className="flex flex-col w-full h-full py-2 space-y-0 bg-white border border-gray-300 rounded-md">
                 { Object.entries(a).map((t,k) => (<Link key={k} href={'/hashtag/'+t[0]} className="flex flex-col w-full p-4 py-4 px-6 space-y-[2px]"><h1 className="font-semibold text-md">#{t[0]}</h1><h1 className="text-sm">{t[1]} {t[1]>1?"Posts":"Post"}</h1></Link>)) }          

        </div>
    )
}