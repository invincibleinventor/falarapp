'use client'
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function Notification(props:any)
{
    const supabase = createClient()
    async function notify(){
        const {error} = await supabase.from('notifications').update({seen:true}).eq('id',props.id)
        const {data:s,error:ss} = await supabase.from('user').select('notifications').eq('id',props.userid)
        if(ss){
            alert(ss.message)
        }
        else{
            if(s && s.length>0){
                const notify = s[0]["notifications"]-1
        const {error:es} = await supabase.from('user').update({'notifications':notify}).eq('id',props.userid)

        if(error){
            console.log(error)
        }
        
        else{
            window.location.replace(props.url)
        }

        if(es){
            alert(es.message)
            console.log(es)
        }}
    }
    }
    return(
<div onClick={()=>(notify())} className={`flex cursor-pointer flex-row px-8 py-5 space-x-5 border-b border-b-gray-900 ${!props.seen?'bg-cyan-500/10':'bg-black'}`}>
                    <div className="flex flex-col items-center content-center flex-shrink-0 shrink-0">
                        <img src={props.image} className="w-8 h-8 rounded-full lg:h-10 lg:w-10"></img>
                    </div>
                    <div className="flex flex-col space-y-[2px]">
                        <h1 className="text-base font-medium text-white lg:text-lg">{props.title}</h1>
                        <h1 className="text-xs text-gray-500 lg:text-sm">{props.description}</h1>
                    </div>                   
                </div>
    )
}

                