import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, setDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';

import { toast } from "react-toastify";


// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

// Singup function for the user
const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    
    const user = res.user;

    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey, There i am using Sphere",
      lastSeen: Date.now()
    })

    await setDoc(doc(db, "chats", user.uid), {
      chatsData: []
    })

  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "))
  }

}

// Login function for the user
const login = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password)

  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "))
  }

}

// Logout function for the user
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "))
  }
}

// Fuction to send the Reset password mail to the user.
const resetPass = async (email) => {
  if (!email) {
    toast.error("Enter your email")
    return null
  }

  try {
    const userRef = collection(db, 'users');

    const q = query(userRef, where("email", "==", email));
    const querySnap = await getDocs(q);

    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth, email)
      toast.success("Reset Email Sent")
    }
    else {
      toast.error("Email doesn't exists")
    }

  } catch (error) {
    console.error(error)
    toast.error(error.message)
  }
  
}

export  {signup, login, logout, auth, db, resetPass}