'use client';
export default function Iof(props:any){
    return(
        <img onClick={()=>window.open(props.src,'_blank')?.focus()} className="object-cover w-full border rounded-lg h-max aspect-video" src={props.src}></img>

    )
}