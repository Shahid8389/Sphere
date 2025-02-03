import react, { useContext, useEffect } from 'react';
import Login from './Pages/Login';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Chat from './Pages/Chat';
import ProfileUpdade from './Pages/ProfileUpdade';
import { AppContext } from './context/AppContext';

import { ToastContainer } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

function App() {

  const navigate = useNavigate();
  const { loadUserData } = useContext(AppContext)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate("/chat")
        
        await loadUserData(user.uid)
               
      } else {
        navigate("/")
      }

    });
  }, [])
  

  return (
    <div>
      <ToastContainer
        autoClose={4000}
        limit={3}
        newestOnTop
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        theme="dark"
      />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfileUpdade />} />
      </Routes>
    </div>
  )
}

export default App
