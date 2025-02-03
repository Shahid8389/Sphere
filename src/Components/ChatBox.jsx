import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { toast } from 'react-toastify'
import { uploadChatImage } from '../lib/uploadCloudinary'

const ChatBox = () => {

  const { userData, chatUser, messagesId, messages, setMessages, chatVisible, setChatVisible } = useContext(AppContext)

  const [input, setInput] = useState("")

  // Function to send the messages to the users
  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date()
          })
        })

        const userIDs = [chatUser.rId, userData.id]

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id)
          const userChatsSnapshot = await getDoc(userChatsRef)

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((comm) => comm.messageId === messagesId);  // finding the index of ongoing users communication(comm).

            // Updating the lastMessage, updatedAt and messageSeen Data in the users database
            if (input.length > 30) {
              userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30) + "...";
            }
            else {
              userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            }

            userChatData.chatsData[chatIndex].updatedAt = Date.now();

            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }

            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData
            })

          }

        })
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error);
    }

    // Sets the text input field empty after sending the message.
    setInput("");

  }

  // Function to send the images to the users
  const sendImage = async (e) => {
    try {

      const UploadedImageUrl = await uploadChatImage(e.target.files[0])

      if (UploadedImageUrl && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: UploadedImageUrl,
            createdAt: new Date()
          })
        })

        const userIDs = [chatUser.rId, userData.id]

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id)
          const userChatsSnapshot = await getDoc(userChatsRef)

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((comm) => comm.messageId === messagesId);  // finding the index of ongoing users communication(comm).

            // Updating the lastMessage, updatedAt and messageSeen Data in the users database
            userChatData.chatsData[chatIndex].lastMessage = "Image...";
            userChatData.chatsData[chatIndex].updatedAt = Date.now();

            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }

            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData
            })

          }

        })
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error);
    }

  }

  // converting the timestamp to the needed(e.g., 5:05 PM) format
  const convertTimestamp = (timestamp) => {
    let date = timestamp.toDate();

    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, "0");

    if (hour === 0) {
      return `12:${minute} AM`;
    }
    else if (hour === 12) {
      return `12:${minute} PM`;
    }
    else if (hour > 12) {
      return `${hour - 12}:${minute} PM`;
    }
    else {
      return `${hour}:${minute} AM`;
    }
  }

  // Storing all the messages from the database into the messages
  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        setMessages(res.data().messages.reverse())
      })

      return () => {
        unSub();
      }

    }

  }, [messagesId])


  return chatUser ? (
    <div className={`bg-gray-100 relative h-full overflow-y-scroll ${chatVisible ? "" : "max-sm:hidden"} `}>

      {/* Header of the chatBox - showing user profile image, name and online status */}
      <div className='flex items-center justify-between bg-white py-1.5 px-2 shadow-sm absolute right-0 top-0 left-0 z-50'>
        <div className='flex items-center gap-0.5'>
          <img className='w-9 rounded-full' src={chatUser.userData.avatar} alt="" />
          <h2 className='text-sm pl-1.5'>{chatUser.userData.name}</h2>
          {/* Check if the user is not online then hide the green dot. */}
          {
            Date.now() - chatUser.userData.lastSeen <= 70000
              ? <img className='w-3' src={assets.green_dot} alt="" />
              : null
          }
        </div>

        <img className='w-5 cursor-pointer max-sm:hidden' src={assets.help_icon} alt="" />

        <img onClick={() => setChatVisible(false)} className='w-5 cursor-pointer sm:hidden' src={assets.arrow_icon} alt="" />

      </div>

      {/* --- Show the Sender and Receiver messages --- */}
      <div className='text-xs flex flex-col-reverse gap-3 px-2 py-1.5 absolute right-0 bottom-11 left-0 top-12 overflow-y-scroll z-10'>

        {
          messages.map((msg, index) => (
            <div key={index} className={msg.sId === userData.id ? "flex items-end justify-end gap-2" : "flex items-end flex-row-reverse justify-end gap-2"}>
              {
                msg["image"]
                  ? <img className={`max-w-[50%] ${msg.sId === userData.id ? "rounded-[6px_6px_0_6px]" : "rounded-[6px_6px_6px_0px]"} `} src={msg.image} alt="" />
                  : <p className={msg.sId === userData.id ? "max-w-[55%] bg-blue-700/90 text-white py-1 px-2 rounded-[6px_6px_0_6px]" : "max-w-[55%] bg-blue-700/90 text-white py-1 px-2 rounded-[6px_6px_6px_0px]"}>{msg.text}</p>
              }

              <div className='flex flex-col gap-1 mb-[-5px]'>
                <img className='w-6 rounded-full' src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
                <p className='text-[10px]'>{convertTimestamp(msg.createdAt)}</p>
              </div>

            </div>
          ))
        }

      </div>

      {/* Footer of the chatBox - To send messages and images to the user */}
      <div className='flex items-center gap-3 absolute bottom-0 left-0 right-0 bg-white py-2 pl-2 shadow-sm pr-3 z-50'>

        <input onChange={(e) => setInput(e.target.value)} value={input} className='text-sm outline-none border-none flex-1' type="text" placeholder='Send a message' />

        <input onChange={sendImage} type="file" id='image' accept='.png, .jpg, .jpeg, .gif, .webp' hidden />
        <label htmlFor="image">
          <img className='cursor-pointer w-6' src={assets.gallery_icon} alt="" />
        </label>

        <img onClick={sendMessage} className='cursor-pointer w-7' src={assets.send_button} alt="" />
      </div>

    </div>
  ) :
    <div className={`h-full flex items-center justify-center flex-col ${chatVisible ? "" : "max-sm:hidden"}`}>
      <img className='w-[30%]' src={assets.logo_icon} alt="Logo icon" />
      <p className='text-slate-950 text-xl xl:text-2xl font-[405]'>Sphere</p>
    </div>

}

export default ChatBox