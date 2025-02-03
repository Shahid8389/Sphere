import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../config/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

import { uploadProfileImage } from '../lib/uploadCloudinary'

const ProfileUpdade = () => {

  const { navigate, setUserData } = useContext(AppContext)

  const [image, setImage] = useState(false)
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [uid, setUid] = useState("")
  const [prevImage, setPrevImage] = useState("")

  // fuction to update the profile details
  const profileUpdate = async (event) => {
    event.preventDefault();

    try {
      if (!prevImage && !image) {
        toast.warning("Upload profile picture")
      }

      const docRef = doc(db, "users", uid);
      
      if (image) {
        const imageUrl = await uploadProfileImage(image)

        await updateDoc(docRef, {
          avatar: imageUrl,
          bio: bio,
          name: name
        })

      }
      else{
        await updateDoc(docRef, {
          bio: bio,
          name: name
        })
      }

      const snap = await getDoc(docRef);
      setUserData(snap.data())

      navigate("/chat")

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }

  }


  // check if the users name, bio and the profile image is available already in the database then store it in the state and show it
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid)

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.data().name) {
          setName(docSnap.data().name);
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        }
        if (docSnap.data().avatar) {
          setPrevImage(docSnap.data().avatar);
        }

      }
      else {
        navigate("/")
      }

    })
  }, [])


  return (
    <div className='flex items-center justify-center bg-[url(./assets/background.png)] h-screen'>

      <div className='flex gap-6 max-sm:gap-1 bg-white w-[60%] rounded-md'>

        <form onSubmit={profileUpdate} className='flex flex-col gap-4 pl-6 py-7 w-full max-sm:pr-6'>
          <h3 className='text-lg font-medium'>Profile Details</h3>

          <label className='flex items-center gap-3' htmlFor="avatar">
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />

            <img className='w-[22%] cursor-pointer rounded-full aspect-square object-cover' src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
            <p className='text-xs text-gray-600'>upload profile image</p>
          </label>

          <input onChange={(e) => setName(e.target.value)} value={name} className='border border-slate-900 outline-none px-2 py-1 rounded-sm text-sm' type="text" placeholder='Your name' required />

          <div className='flex flex-col gap-0'>
            <textarea onChange={(e) => setBio(e.target.value)} value={bio} className='border border-slate-900 outline-none px-2 py-1 w-full rounded-sm text-sm' placeholder='write profile bio' maxLength="80" rows="3"></textarea>
            <p className='text-xs text-gray-500'>Note: Bio, should be less than or equal to 80 characters.</p>
          </div>

          <button className='bg-blue-700/95 hover:bg-blue-800 text-white text-sm mt-3 py-0.5'>Save</button>

        </form>

        <div className={`flex items-center justify-center max-sm:hidden ${image ? '' : "mt-[12%]"} w-[75%]`}>
          <img className='w-[70%] rounded-full aspect-square object-cover' src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_big} alt="" />
        </div>

      </div>
    </div>
  )
}

export default ProfileUpdade