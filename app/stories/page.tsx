/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client'
import Stories from 'react-insta-stories'
export default function StoryView(){
  const stories = [
    {
      url: 'https://example.com/pic2.jpg',
      duration: 5000,
      header: {
        heading: 'Mohit Karekar',
        subheading: 'Posted 30m ago',
        profileImage: 'https://picsum.photos/100/100',
      }
    },
    {
      url: 'https://example.com/pic2.jpg',  
      duration: 5000,
      header: {
        heading: 'Mohit Karekar',
        subheading: 'Posted 30m ago',
        profileImage: 'https://picsum.photos/100/100',
      },
    
	},
  ];
  return(
    <div className='absolute z-[100000] bg-black h-screen lg:h-max lg:w-max lg:mx-auto w-screen left-0 right-0 bottom-0 top-0 flex flex-col items-center justify-center lg:static'>
      <div className='absolute flex items-center content-center justify-between text-white lg:hidden top-5 left-5'><h1 className="text-2xl font-semibold text-white">Story</h1></div>
  <Stories
     storyContainerStyles={{height: '@apply h-screen lg:h-48', width: '@apply w-screen lg:w-48'}}
			stories={stories}
			defaultInterval={1500}
			
		/>
    </div>
  )
}


