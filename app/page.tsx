import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import Link from "next/link";
  import { createClient } from '@/utils/supabase/server' 
  import { cookies } from 'next/headers';
import StoriesView from '@/components/StoriesView'
import PostComponent from '@/components/PostComponent'
import { redirect } from 'next/navigation'
export default async function Index() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
const canInitSupabaseClient = () => {
  // This function is just for the interactive tutorial.
  // Feel free to remove it once you have Supabase connected.
  try {
    createClient(cookieStore)
    return true
  } catch (e) {
    return false
  }
}
TimeAgo.locale(en)

const timeAgo = new TimeAgo('en-US')
const date1 = new Date();
const isSupabaseConnected = canInitSupabaseClient()
let empty = true
  let posts = []
let loading = true

  async function get(){
    const {data:user} = await supabase.auth.getUser()
    let s = user.user.id
    const {data:u} = await supabase.from('user').select('*').eq('id',s)
    let l = u[0]["following"]
    let h = u[0]["handle"]
    let ds=[]
    
      l.push(h)
    const {data,error} = await supabase.from('posts').select('*').order('id',{ascending:false}).in('handle',l) 
    if(error){
    }
    else{
  
     ds = data
      
     for await (const [index,post] of ds.entries()) {
     
        const {data,error} = await supabase.from('user').select('*').eq('id',post.poster)
        ds[index].name = data[0].name
        let date2 = new Date(ds[index].created_at)
        ds[index].diff = date1.getTime()-date2.getTime()
        ds[index].dp = data[0].image
        
       
        
      
     
      }
      
    
      if(ds.length>0){
        empty =false
      }
      else{
       empty =true
      }
       posts = ds;loading  = false
      
   
    }


    
    }
await get()
  if(isSupabaseConnected){
  

  return(<><div className='flex-1 h-screen p-0 py-2 overflow-x-hidden overflow-y-hidden'>
  <div className="p-4 py-2 pb-4 mx-1 md:mx-1">
    <div className="relative items-center content-center">
    <svg viewBox="0 0 24 24" aria-hidden="true" className=" top-0 bottom-0 my-auto absolute ml-6 w-[18px] h-[18px] text-black"><g><path fill="currentColor" d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path></g></svg>
    <input className="w-full border border-gray-150 bg-white peer h-12 focus:outline-black focus:bg-white placeholder:text-neutral-600 font-poppins pl-14 pr-8 text-[14px]" placeholder="Search Evolt"></input>
    </div>
</div>
  <div className='h-full overflow-y-scroll hiddenscroll'>
  
  <div className='flex flex-col gap-2 mb-20 animate-in hiddenscroll'>
    
  {!loading ? !empty ? ( posts.map((post) => (
<PostComponent id={post.id} cover={post.cover} title={post.title} time={timeAgo.format(Date.now() - post.diff)} key={post.id} image={post.image} dp={post.dp} handle={post.handle} name={post.name} description={post.excerpt}/>
 ))) : 
    (
      <div className="flex items-center content-center w-full px-10 mt-24 lg:px-24 sm:px-24 md:px-16">
            <div className="flex flex-col gap-2 mx-auto max-w-max">
            <h1 className="mx-auto text-lg font-semibold text-center text-black">No Posts To View!</h1>
            <h1 className="mx-auto text-sm text-center text-neutral-400">Follow people to view their posts on your home feed. The more people you follow, the more posts on your feed</h1>
            <Link href="/explore" className={`w-max mx-auto text-xs font-bold mt-3 px-8 py-3  ${(1==1)?'bg-black text-white':'bg-white border-2'}`}>Explore People</Link>
      
            </div>
            
          </div>
    )
    :(<div className="flex items-center content-center w-full h-screen">
 
</div>)} </div> </div></div></>

  ) }else{return(<></>)}}
