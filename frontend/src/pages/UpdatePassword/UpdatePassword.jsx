import React, { useState } from 'react'
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from '../../store/useAuthStore.js';

function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const { updatePassord } = useAuthStore();
  const { email } = useParams();

  const handleVerify = async(e) => {
    debugger;
    e.preventDefault();
    if(!password || !confirmPassword){
      toast.error("Please fill all the fields");
      return;
    }
    else if(password.length<6){
      toast.error("Password should be at least 6 characters long");
      return;
    }
    if(password !== confirmPassword){
      toast.error("Passwords do not match");
      return;
    }
    await updatePassord({email, password});
    navigate('/login');
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-lg backdrop-blur-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Update Password
        </h1>
        <form onSubmit={handleVerify}>
          <div className="mb-4">
            <label className="block text-gray-700">Enter Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdatePassword