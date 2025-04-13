import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from '../../store/useAuthStore.js';

const VerifyOtp = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        otp: "",
        email: "",
      });
    const { verifyOtp } = useAuthStore();
  
    const handleVerify = async (e) => {
      e.preventDefault();
  
      if (!formData.otp.trim()) {
        toast.error("Please enter the OTP");
        return;
      }

      verifyOtp(formData);
    };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-lg backdrop-blur-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Verify Your Email
        </h1>
        <form onSubmit={handleVerify}>
          <div className="mb-4">
            <label className="block text-gray-700">Enter OTP</label>
            <input
              type="text"
              maxLength={4}
              placeholder="1234"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg cursor-pointer"
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-4 text-center">
            <Link to="/signup" className="text-blue-500 hover:underline">
            Go back to Signup
            </Link>
        </div>
      </div>
    </div>
  )
}

export default VerifyOtp
