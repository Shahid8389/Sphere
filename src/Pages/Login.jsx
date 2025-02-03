import React, { useState } from 'react'
import assets from '../assets/assets'
import { login, resetPass, signup } from '../config/firebase'

const Login = () => {

  // Sign Up || Login
  const [currentState, setCurrentState] = useState('Login')
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (currentState === "Sign Up") {
      signup(username, email, password);
    }
    else {
      login(email, password);
    }

  }

  return (
    <div className='flex items-center md:justify-between h-screen w-full bg-[url(./assets/background.png)] bg-cover bg-center md:pr-40 md:flex-row flex-col justify-center max-md:gap-8 xl:pr-60 pr-0'>
      <div className='flex items-center flex-col'>
        <img className='xl:w-[40%] md:w-[35%] w-[30%]' src={assets.logo_icon} alt="" />
        <h1 className='md:text-4xl sm:text-3xl text-3xl text-white'>Sphere</h1>
      </div>

      <form onSubmit={onSubmitHandler} className='border border-gray-400 flex flex-col gap-4 px-5 py-3 bg-white rounded-md'>

        <h2 className='text-xl font-medium'>{currentState}</h2>

        {currentState === 'Sign Up' ? <input onChange={(e) => setUsername(e.target.value)} value={username} className='border border-gray-500 px-2 py-1 rounded-sm outline-none' type="text" placeholder='username' required /> : null}

        <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-gray-500 px-2 py-1 rounded-sm outline-none' type="email" placeholder='email address' required />

        <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-gray-500 px-2 py-1 rounded-sm outline-none' type="password" placeholder='password' required />

        <button className='bg-blue-500 text-white py-1 font-medium rounded-sm' type="submit">{currentState}</button>

        <div>
          {currentState === 'Sign Up' ?
            <p className='text-sm'>Already have an account?<span className='text-blue-600 cursor-pointer' onClick={() => setCurrentState("Login")} > click here</span></p> :
            <p className='text-sm'>Don't have an account?<span className='text-blue-600 cursor-pointer' onClick={() => setCurrentState("Sign Up")} > click here</span></p>}

          {/* For the Reset password */}
          {
            currentState === 'Login'
              ? <p className='text-sm'>Forgot Password?<span className='text-blue-600 cursor-pointer' onClick={() => resetPass(email)} > reset here</span></p>
              : null
          }

        </div>

      </form>
    </div>
  )
}

export default Login