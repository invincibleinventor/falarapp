'use client';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import notification from '@/utils/notifications/notification';

export default function UserInformation(props: any) {
    const [handle, setHandle] = useState<any>()
    const supabase = createClient();
    const [blocked,setBlocked] = useState<any>();
    const [user, setUser] = useState<any>()
    const [myImage,setMyImage]  = useState<any>()
    const [myId, setMyId] = useState<any>();
    const [myuserid, setUserid] = useState<any>();
    const [showPopup, setShowPopup] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [imfollowing, setImFollowing] = useState<any>(props.imfollowing);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const [followerlist, setFollowerList] = useState(props.followerlist);
    const [followinglist, setFollowingList] = useState(props.followinglist);
    const [notifications, setNotifications] = useState(props.notifications);
  
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0, showAbove: false });
    const [isPositioned, setIsPositioned] = useState(false);

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setShowPopup(true);
        setTimeout(() => setIsVisible(true), 50);
    };

    const handleMouseLeave = (e: React.MouseEvent) => {
        const popupElement = document.getElementById('user-info-popup');
        const imageContainer = containerRef.current;
        const relatedTarget = e.relatedTarget as Element;

        if (popupElement?.contains(relatedTarget) || imageContainer?.contains(relatedTarget)) {
            return;
        }

        const rect = imageContainer?.getBoundingClientRect();
        const popupRect = popupElement?.getBoundingClientRect();
        
        if (rect && popupRect) {
            const cursorY = e.clientY;
            const isBetweenElements = 
                (cursorY > rect.bottom && cursorY < popupRect.top) ||
                (cursorY < rect.top && cursorY > popupRect.bottom);
            
            if (isBetweenElements) {
                return;
            }
        }

        timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                setShowPopup(false);
                setIsPositioned(false);
            }, 150);
        }, 100);
    };

    useEffect(() => {
        function updatePosition() {
            if (!containerRef.current || !showPopup) return;

            const rect = containerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const popupHeight = 280;
            const showAbove = spaceBelow < popupHeight && rect.top > popupHeight;

            const newPosition = {
                
                top: showAbove 
                    ? rect.top + window.scrollY - popupHeight + 20
                    : rect.bottom + window.scrollY + 10,
                left: Math.max(10, rect.left + window.scrollX),
                showAbove
            };

            setPopupPosition(newPosition);
            if (!isPositioned) {
                setIsPositioned(true);
            }
        }

        if (showPopup) {
            updatePosition();
            window.addEventListener('scroll', updatePosition);
            window.addEventListener('resize', updatePosition);
            return () => {
                window.removeEventListener('scroll', updatePosition);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [showPopup, isPositioned]);

    useEffect(() => {
        async function fetchData() {
            const { data: u } = await supabase.auth.getUser();
            if (u?.user) {
                const { data, error } = await supabase.from('user').select('*').eq('id', props.id);
                const { data: mine, error: e } = await supabase.from('user').select('image,handle,blocked,blockedby').eq('id', u.user.id);
    
                if (data && mine && !error && mine.length > 0 && data.length > 0) {
                    setUser(data[0]);
                    setHandle(data[0].handle);
                    setMyId(mine[0].handle);
                    setUserid(u.user.id);
                    setMyImage(mine[0].image)
                    
                    if (props.imfollowing !== undefined) {
                        setImFollowing(props.imfollowing);
                    } else {
                        if((data[0].followers).includes(mine[0].handle))
                        setImFollowing(true);
                    else
                    setImFollowing(false);
                    }
                    
                }
            }
        }
    
        fetchData();
    }, [props.id, props.imfollowing]);
    

    const handleFollow = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        
        if (props.onfollow) {
            props.onfollow(handle);
            return;
        }
else{
  
    let localfollowerlist,localfollowinglist;
    const {data:his} = await supabase.from('user').select('*').eq('handle',handle);
    const {data:mine} = await supabase.from('user').select('*').eq('handle',myId);
    if(his && mine){
      localfollowerlist = his[0]["followers"];
      localfollowinglist = mine[0]["following"];
    }
    if (imfollowing) {
      let arr = localfollowerlist;
      arr = arr.filter((item: any) => item !== myId);
      let arr2 = localfollowinglist;
      arr2 = arr2.filter((item: any) => item !== handle);

      const { data, error } = await supabase.from("user").update({ followers: arr }).eq("handle", handle).select();
      const { data: d, error: e } = await supabase.from("user").update({ following: arr2 }).eq("handle", myId).select();
      
      if (!error && !e) {
        setFollowerList(arr);
        setFollowingList(arr2);
        setImFollowing(false);
      }
    } else {
      const arr = localfollowerlist;
      arr.push(myId);
      const arr2 = localfollowinglist;
      arr2.push(handle);
      const { data, error } = await supabase.from("user").update({ followers: arr }).eq("handle", handle).select();
      const { data: d, error: e } = await supabase.from("user").update({ following: arr2 }).eq("handle", myId).select();

      if (!error && !e) {
        notification(
          notifications,
          supabase,
          props.id,
          "/profile/" + myId,
          "New Follower",
          "follow",
          myuserid,
          "@" + myId + " has followed you! Follow them back?",
          myImage
        );
        setImFollowing(true);
        setFollowerList(arr);
        setFollowingList(arr2);
      }
    }
    return imfollowing;
  
}
    };

    const popup = user && showPopup && createPortal(
        <div 
            id="user-info-popup"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ 
                position: 'absolute',
                top: `${popupPosition.top}px`,
                left: `${popupPosition.left}px`,
                zIndex: 2147483647,
                opacity: isVisible && isPositioned ? 1 : 0,
                transition: 'opacity 150ms ease-in-out',
                pointerEvents: isVisible ? 'auto' : 'none',
                visibility: isPositioned ? 'visible' : 'hidden'
            }}
            className='p-2 pb-4 w-64 h-auto bg-gradient-to-t to-black rounded-lg border shadow-lg from-primary-950 border-neutral-900 shadow-neutral-900'
        >
            <div className='relative w-full h-full'>
                <img src={user.cover} className='w-full h-20 bg-black rounded-t-lg aspect-cover'></img>
                <img className='absolute left-2 top-12 w-14 h-14 rounded-lg' src={user.image}></img>
                <div className='flex flex-col mx-2 mt-8 space-y-2'>
                    <div className='flex flex-row justify-between content-center items-center'>
                        <div className='flex flex-col'>
                            <h1 className='text-base font-semibold text-white'>{user.name}</h1>
                            <h1 className='text-sm text-neutral-400'>@{user.handle}</h1>
                        </div>
                        <div className='ml-auto'>
                            {myId != handle &&
                                <button
                                    onClick={handleFollow}
                                    className={
                                        imfollowing
                                            ? "px-4 py-1 text-xs text-black bg-white rounded-full border border-black h-max"
                                            : "px-4 py-1 text-xs text-white rounded-full border border-black h-max bg-primary-800"
                                    }
                                >
                                    {imfollowing ? "Unfollow" : "Follow"}
                                </button>
                            }
                        </div>
                    </div>
                    <div className='flex flex-row space-x-[4px] two-line-ellipsis items-center content-center'>
                        <h1 className='text-sm text-neutral-300'>{user.about}</h1>
                    </div>
                    <div className='grid grid-cols-2 pt-2'>
                        <div className='flex flex-row content-center items-center space-x-1'>
                            <h1 className="text-sm font-semibold text-neutral-300">
                                {user.followers?.length}
                            </h1>
                            <h1 className="text-sm text-neutral-400">Followers</h1>
                        </div>
                        <div className='flex flex-row content-center items-center space-x-1'>
                            <h1 className="text-sm font-semibold text-neutral-300">
                                {user.following?.length}
                            </h1>
                            <h1 className="text-sm text-neutral-400">Following</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );

    return (
        <div 
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={(e: any) => e.stopPropagation()} 
            className='relative'
        >
            <Image 
                alt="user image" 
                src={props.image} 
                width={32} 
                height={32} 
                className={props.imgclass + " filter hover:brightness-90"} 
            />
            {popup}
        </div>
    );
}
