import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Chat from './pages/Chat/Chat';
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate';
import Signup from './pages/Signup/Signup';
import { useAuthStore } from './store/useAuthStore';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import VerifyOtp from './pages/VerifyOtp/VerifyOtp';
import VerifyOtpForForgotPassword from './pages/VerifyOtpForForgotPassword/VerifyOtpForForgotPassword';
import EmailForForgotPassword from './pages/EmailForForgotPassword/EmailForForgotPassword';
import UpdatePassword from './pages/updatePassword/UpdatePassword';

function App() {
  const { authUser, checkAuth, isCheckingAuth, isForgotPasswordOtpCorrect, isForgotPasswordOtpVerified } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);

  // Show loader while checking auth
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin text-black" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/chat" />} />
        <Route path="/EmailForForgotPassword" element={ <EmailForForgotPassword /> } />
        <Route path="/verifyOtpForForgotPassword/:email" element={<VerifyOtpForForgotPassword /> } />
        <Route path="/UpdatePassword/:email" element={<UpdatePassword/>}/>
        <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/chat" />} />
        <Route path="/verifyotp" element={!authUser ? <VerifyOtp /> : <Navigate to="/chat" />} />
        <Route path="/chat" element={authUser ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/profileUpdate" element={authUser ? <ProfileUpdate /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={authUser ? "/chat" : "/login"} />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
