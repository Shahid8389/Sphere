import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { logout } from '../config/firebase'
import { AppContext } from '../context/AppContext'

const RightSidebar = () => {

  const { chatUser, messages } = useContext(AppContext)
  const [msgImages, setMsgImages] = useState([])


  useEffect(() => {
    let tempVar = [];

    messages.map((msg)=> {
      if (msg.image) {
        tempVar.push(msg.image)
      }
    })

    setMsgImages(tempVar);

  }, [messages])
  
  
  return chatUser ? (
    <div className='bg-slate-950 text-white h-full relative max-md:hidden'>
      <div className='flex items-center flex-col mt-10 mx-4'>
        <img className='w-20 rounded-full' src={chatUser.userData.avatar} alt="" />

        <div className='flex gap-0.5 items-center'>
          <h2 className='text-lg text-center'>{chatUser.userData.name}</h2>
          {
            Date.now() - chatUser.userData.lastSeen <= 70000 
            ? <img className='h-4 aspect-square' src={assets.green_dot} alt="" />
            : null
          }
        </div>

        <p className='text-xs text-center text-gray-300/80'>{chatUser.userData.bio}</p>
      </div>

      <h3 className='border-t-2 border-gray-600 mt-5 pt-2 pl-3'>Media</h3>

      <div className='grid grid-cols-[1fr_1fr_1fr] gap-2 px-3 pt-2'>
        {
          msgImages.map((url, index)=> (
            <img key={index} onClick={()=> window.open(url)} className='h-9 xl:h-12 w-full object-fill cursor-pointer' src={url} alt="" />
          ))
        }
        
      </div>

      <div className='absolute bottom-4 left-0 right-0 flex justify-center'>
        <button onClick={() => logout()} className='bg-blue-600/90 py-1.5 px-4 text-sm rounded-full w-[70%]'>Logout</button>
      </div>

    </div>
  ) :
    <div className='bg-slate-950 text-white h-full relative max-md:hidden'>
      <div className='absolute bottom-4 left-0 right-0 flex justify-center'>
        <button onClick={() => logout()} className='bg-blue-600/90 py-1.5 px-4 text-sm rounded-full w-[70%]'>Logout</button>
      </div>
    </div>
}

export default RightSidebar