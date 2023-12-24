'use client'
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import {useInView} from 'react-intersection-observer'
import { Oval } from 'react-loader-spinner';
import PostComponent from './PostComponent';
export default function More(props){
    const supabase = createClient()
    const [offset, setOffset] = useState(1)
    const { ref, inView } = useInView();
    const [halt,setHalt] = useState(false)
    const [posts,setPosts] = useState([])
    TimeAgo.locale(en)
let PAGE_COUNT = 5
const timeAgo = new TimeAgo('en-US')
const date1 = new Date();

    async function get(from,to){
          if(props.handle){
          const {data,error} = await supabase.from('posts').select('*').eq('handle',props.handle).order('id',{ascending:false}).range(from,to)
          if(error){
            console.log(error)
          }
          else{
            if(data && data.length>0){
            console.log(data)
           let ds = data
           for await (const [index,post] of ds.entries()) {
             
            const {data,error} = await supabase.from('user').select('*').eq('id',post.poster)
            ds[index].name = data[0].name
            
            ds[index].dp = data[0].image
           
            let date2 = new Date(ds[index].created_at)
            ds[index].diff = date1.getTime()-date2.getTime()
          
         
          }
           setPosts((prev)=>[...prev,...ds])
           if (ds.length < PAGE_COUNT) {
            setHalt(true)
          }
          }
          }
        }
        else{
            const {data,error} = await supabase.from('posts').select('*').order('id',{ascending:false}).in('handle',props.in).range(from,to)
            if(error){
              console.log(error)
            }
            else{
              if(data && data.length>0){
              console.log(data)
             let ds = data
             for await (const [index,post] of ds.entries()) {
               
              const {data,error} = await supabase.from('user').select('*').eq('id',post.poster)
              ds[index].name = data[0].name
              
              ds[index].dp = data[0].image
             
              let date2 = new Date(ds[index].created_at)
              ds[index].diff = date1.getTime()-date2.getTime()
            
           
            }
             setPosts([...posts,...ds])
             if (ds.length < PAGE_COUNT) {
                setHalt(true)
              }
            }
           
            }
          }
    }
    useEffect(()=>{
        if(inView){
            setOffset((prev) => prev + 1)
            
        
    
        const from = offset * PAGE_COUNT 
        const to = from + PAGE_COUNT - 1
        
        get(from,to)}},[inView])
return(<>
<div  className="flex flex-col items-center content-center gap-2">
{posts.map((post) => (
<PostComponent id={post.id} type="profile" title={post.title} cover={post.cover} time={timeAgo.format(Date.now() - post.diff)} key={post.id} image={post.image} dp={post.dp} handle={post.handle} name={post.name} description={post.excerpt}/>
 ))}
 <Oval
   height={80}
   width={80}
   color="#000000"
   wrapperStyle={{}}
   wrapperClass="mx-auto"
   visible={!halt?true:false}
   ariaLabel='oval-loading'
   secondaryColor="#808080"
   strokeWidth={2}
   strokeWidthSecondary={2}
   
   />
   <div className={!halt?'':'hidden'} ref={ref}></div>
 </div>
</>)
}
