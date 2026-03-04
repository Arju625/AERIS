import { useState } from 'react';
import { useLocation } from 'react-router-dom';

function SocialIcons() {
  return (
    <div className="flex gap-3 justify-center">
      {/* Google */}
      <button className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:opacity-80 transition-opacity">
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
          <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
          <path fill="#4A90D9" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
          <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
        </svg>
      </button>
      {/* Facebook */}
      <button className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center hover:opacity-80 transition-opacity">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>
      {/* Apple */}
      <button className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center hover:opacity-80 transition-opacity">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      </button>
    </div>
  );
}

function LoginForm() {
  return (
    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-10 md:px-16 py-12 md:py-20 w-full max-w-md md:max-w-xl">
      <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">Login</h2>

      <div className="space-y-8 mb-10">
        {/* Email */}
        <div className="flex items-center gap-4 border-b border-gray-300 pb-3">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
          <input
            type="email"
            placeholder="Email ID"
            className="flex-1 outline-none text-base md:text-lg text-gray-500 placeholder-gray-400 bg-transparent font-medium"
          />
        </div>

        {/* Password */}
        <div className="flex items-center gap-4 border-b border-gray-300 pb-3">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <input
            type="password"
            placeholder="Password"
            className="flex-1 outline-none text-base md:text-lg text-gray-500 placeholder-gray-400 bg-transparent font-medium"
          />
          <button className="text-sm md:text-base font-bold text-primary-red hover:opacity-80 flex-shrink-0">Forgot?</button>
        </div>
      </div>

      <button className="w-full bg-primary-red text-white font-bold py-4 rounded-full text-lg hover:opacity-90 transition-opacity mb-8">
        Login
      </button>

      <SocialIcons />
    </div>
  );
}

function SignupForm() {
  return (
    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-10 md:px-16 py-12 md:py-16 w-full max-w-md md:max-w-xl">
      <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-6">Sign Up</h2>

      <div className="mb-8">
        <SocialIcons />
      </div>

      <div className="space-y-6 mb-8">
        <div className="border-b border-gray-300 pb-3">
          <input
            type="email"
            placeholder="Email ID"
            className="w-full outline-none text-base md:text-lg text-gray-500 placeholder-gray-400 bg-transparent font-medium"
          />
        </div>
        <div className="border-b border-gray-300 pb-3">
          <input
            type="password"
            placeholder="Password"
            className="w-full outline-none text-base md:text-lg text-gray-500 placeholder-gray-400 bg-transparent font-medium"
          />
        </div>
        <div className="border-b border-gray-300 pb-3">
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full outline-none text-base md:text-lg text-gray-500 placeholder-gray-400 bg-transparent font-medium"
          />
        </div>
        <div className="border-b border-gray-300 pb-3">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full outline-none text-base md:text-lg text-gray-500 placeholder-gray-400 bg-transparent font-medium"
          />
        </div>
        <div className="border-b border-gray-300 pb-3">
          <input
            type="tel"
            placeholder="Mobile Number"
            className="w-full outline-none text-base md:text-lg text-gray-500 placeholder-gray-400 bg-transparent font-medium"
          />
        </div>
      </div>

      <button className="w-full bg-primary-red text-white font-bold py-4 rounded-full text-lg hover:opacity-90 transition-opacity">
        Create Account
      </button>
    </div>
  );
}

export default function Auth() {
  const location = useLocation();
  const defaultTab = location.state?.tab ?? 'login';
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="flex h-screen w-screen overflow-hidden font-montserrat">
      {/* Left Panel */}
      <div className="relative w-[45%] flex-shrink-0 overflow-hidden">
        {/* AERIS Logo */}
        <div className="absolute top-8 left-8 z-20 flex items-center gap-4">
          <img src="/assets/logo.svg" alt="Aeris Logo" className="h-[40px] md:h-[50px] object-contain" />
          <div className="h-[30px] md:h-[40px] w-[2px] bg-black"></div>
          <span className="text-2xl md:text-3xl font-black text-black tracking-[-1px]">AERIS</span>
        </div>

        {/* Background Image */}
        <img
          src="/assets/auth.svg"
          alt="Auth Background"
          className="w-full h-full object-cover"
        />

        {/* Tab Buttons — right edge of left panel */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col z-20 gap-2">
          <button
            onClick={() => setActiveTab('login')}
            className={`px-8 md:px-12 py-5 md:py-6 text-lg md:text-xl font-bold rounded-tl-2xl rounded-bl-2xl transition-all cursor-pointer ${activeTab === 'login'
                ? 'bg-white text-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
                : 'bg-white/40 text-white backdrop-blur-md hover:bg-white/50'
              }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`px-8 md:px-12 py-5 md:py-6 text-lg md:text-xl font-bold rounded-tl-2xl rounded-bl-2xl transition-all cursor-pointer ${activeTab === 'signup'
                ? 'bg-white text-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
                : 'bg-white/40 text-white backdrop-blur-md hover:bg-white/50'
              }`}
          >
            Signup
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="w-full px-8 flex justify-center">
          {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
}
