import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { db, logout } from '../config/firebase'
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { toast } from 'react-toastify'

const LeftSidebar = () => {

  const { navigate, userData, chatData, chatUser, setChatUser, messagesId, setMessagesId, chatVisible, setChatVisible } = useContext(AppContext)
  const [user, setUser] = useState(null)
  const [showSearch, setShowSearch] = useState(false)

  // Function to handle the search input and find the user in the database.
  const inputHandler = async (e) => {
    try {
      const input = e.target.value;

      if (input) {
        setShowSearch(true)
        const userRef = collection(db, 'users')

        const q = query(userRef, where("username", "==", input.toLowerCase()))
        const querySnap = await getDocs(q)

        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExists = false

          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExists = true;
            }
          })

          if (!userExists) {
            setUser(querySnap.docs[0].data());
          }

        }
        else {
          setUser(null)
        }

      } else {
        setShowSearch(false)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error);
    }
  }

  // Add the user in the database for the chating.
  const addChat = async () => {
    const messagesRef = collection(db, "messages")
    const chatsRef = collection(db, "chats")

    try {
      const newMessageRef = doc(messagesRef);

      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: []
      })

      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      })

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      })

      // To add the user for the chatting and show the chat box.
      const uSnap = await getDoc(doc(db, 'users', user.id))
      const uData = uSnap.data();

      setChat({
        messagesId: newMessageRef.id,
        lastMessage: "",
        rId: user.id,
        updatedAt: Date.now(),
        messageSeen: true,
        userData: uData
      })

      setShowSearch(false)
      setChatVisible(true)

    } catch (error) {
      toast.error(error.message)
      console.log(error);
    }

  }

  const setChat = async (item) => {

    try {
      setMessagesId(item.messageId)
      setChatUser(item)

      // If user has seen the chat then mark it true.
      const userChatsRef = doc(db, 'chats', userData.id);
      const userChatsSnapshot = await getDoc(userChatsRef);
      const userChatsData = userChatsSnapshot.data();

      // Finding the particular chat of the user among the multiple chats
      const chatIndex = userChatsData.chatsData.findIndex((comm) => comm.messageId === item.messageId)

      userChatsData.chatsData[chatIndex].messageSeen = true;

      await updateDoc(userChatsRef, {
        chatsData: userChatsData.chatsData
      })

      // For the responsive design - if user click on any person then the chat box will be shown and the left side bar will be hidden.
      setChatVisible(true);

    } catch (error) {
      toast.error(error.message)
      console.log(error);
    }

  }

  // Update the chatuser data so that the user online status can be updated realtime.
  useEffect(() => {
    const updataChatUserData = async () => {
      if (chatUser) {
        const userRef = doc(db, "users", chatUser.userData.id);
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data()

        setChatUser(prev => ({...prev, userData: userData}))
      }
    }

    updataChatUserData();

  }, [chatData])
  

  return (
    <div className={`bg-slate-950 text-white h-full overflow-y-scroll scroll-smooth ${chatVisible ? "max-sm:hidden" : ""}`}>
      <div className='px-2 py-2 h-full relative'>

        <div className='flex items-center gap-1'>
          <img className='w-9' src={assets.logo_icon} alt="" />
          <h2>Sphere</h2>

          <div className='ml-auto group'>
            <img className='w-5 cursor-pointer' src={assets.menu_icon} alt="" />

            <div className='absolute top-9 right-4 bg-gray-100 text-black py-2 xl:w-[50%] lg:w-[60%] max-sm:w-[45%] sm:w-[70%] h-fit hidden group-hover:flex flex-col gap-1 rounded-sm'>
              <h4 onClick={() => navigate("/profile")} className='cursor-pointer hover:bg-gray-300 pl-4 py-1 sm:pr-1 lg:pr-0'>Edit Profile</h4>

              <h4 onClick={() => logout()} className='cursor-pointer hover:bg-gray-300 pl-4 py-1'>Logout</h4>
            </div>
          </div>

        </div>

        <div className='flex bg-blue-950/70 items-center gap-2 py-1 px-2 text-sm mt-2'>
          <img className='h-4 aspect-square' src={assets.search_icon} alt="" />

          <input onChange={inputHandler} className='bg-transparent outline-none w-[90%]' type="text" placeholder='search here..' />
        </div>

        <div className='mt-5 overflow-y-scroll scroll-smooth'>
          {
            showSearch && user
              ? <div onClick={addChat} className='flex gap-2 items-center cursor-pointer hover:bg-blue-600/50 px-2 py-1.5'>
                <img className='h-9 aspect-square rounded-full' src={user.avatar} alt="" />
                <div className='flex flex-col'>
                  <h3 className='text-sm text-white'>{user.name}</h3>
                </div>
              </div>
              : chatData.map((item, index) => (
                <div onClick={() => setChat(item)} key={index} className='flex gap-2 items-center cursor-pointer hover:bg-blue-600/50 px-2 py-1.5'>
                  <img className={`h-9 aspect-square rounded-full ${item.messageSeen || item.messageId === messagesId ? "" : "border-sky-400 border-[3px]"} `} src={item.userData.avatar} alt="" />

                  <div className='flex flex-col'>
                    <h3 className='text-sm text-white'>{item.userData.name}</h3>

                    <p className={`text-xs text-gray-300/75 ${item.messageSeen || item.messageId === messagesId ? "" : "text-sky-400 font-medium"} `}>{item.lastMessage}</p>
                  </div>
                </div>
              ))
          }

        </div>

      </div>
    </div>
  )
}

export default LeftSidebar