import { useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from '../../store/useAuthStore.js';

function EmailForForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const { forgotPassword } = useAuthStore();

    const handleEmail = async (e) => {
        debugger;
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your Email");
            return;
        }

        await forgotPassword(email);
        navigate(`/verifyOtpForForgotPassword/${email}`);

    };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-lg backdrop-blur-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Email for OTP Verification
        </h1>
        <form onSubmit={handleEmail}>
          <div className="mb-4">
            <label className="block text-gray-700">Enter Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg cursor-pointer"
          >
            Send OTP
          </button>
        </form>

        <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-500 hover:underline">
                Go back to login
            </Link>
        </div>
      </div>
    </div>
  )
}

export default EmailForForgotPassword