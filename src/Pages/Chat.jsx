import React, { useContext, useEffect, useState } from 'react'
import ChatBox from '../Components/ChatBox'
import LeftSidebar from '../Components/LeftSidebar'
import RightSidebar from '../Components/RightSidebar'
import { AppContext } from '../context/AppContext'

const Chat = () => {

  const { chatData, userData } = useContext(AppContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false)
    }
  }, [chatData, userData])
  

  return (
    <div className='bg-gradient-to-r from-[#415cd5] to-[#272fbe] h-screen w-full flex items-center justify-center'>

      {
        loading
          ? <p className='text-3xl text-gray-100/90'>Loading...</p>
          : <div className='bg-white h-[80%] w-[80%] grid md:grid-cols-[1fr_2fr_1fr] max-sm:grid-cols-1 sm:grid-cols-[1fr_2fr]' >
            <LeftSidebar />
            <ChatBox />
            <RightSidebar />
          </div>
      }

    </div>
  )
}

export default Chat