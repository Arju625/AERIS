import React from "react";

export default function AERISPage() {
  return (
    <div className="font-[Poppins]">
      {/* Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-3 bg-white rounded-full shadow-md m-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            +
          </div>
          <h1 className="font-semibold text-xl tracking-wide">AERIS</h1>
        </div>

        <ul className="flex gap-10 text-gray-700 font-medium text-[15px]">
          <li className="cursor-pointer hover:text-black">Home</li>
          <li className="cursor-pointer hover:text-black">Features</li>
          <li className="cursor-pointer hover:text-black">About</li>
          <li className="border-b-2 border-black pb-1">Contact</li>
        </ul>

        <div className="flex gap-3">
          <button className="bg-teal-500 px-6 py-2 rounded-full text-white text-sm font-medium">
            login
          </button>
          <button className="bg-red-600 px-6 py-2 rounded-full text-white text-sm font-medium">
            Create Account
          </button>
        </div>
      </nav>

      {/* About Section */}
      <section
        className="relative h-[420px] flex flex-col justify-center items-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492724441997-5dc865305da7')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <h2 className="relative text-5xl font-semibold tracking-wider mb-10">
          ABOUT US
        </h2>

        <div className="relative flex w-[80%] justify-between items-start">
          {/* Vision */}
          <div className="w-1/2 pr-10">
            <h3 className="text-red-500 text-2xl font-semibold mb-3">
              Our Vision
            </h3>
            <p className="text-sm leading-relaxed text-gray-200">
              AERIS (Automated Emergency Response Information System) is a smart,
              technology-driven platform designed to provide instant emergency
              assistance using Artificial Intelligence, Machine Learning, and
              location-based services.
            </p>
          </div>

          {/* Divider */}
          <div className="w-[1px] bg-white h-32 mt-2"></div>

          {/* Mission */}
          <div className="w-1/2 pl-10">
            <h3 className="text-red-500 text-2xl font-semibold mb-3">
              Our Mission
            </h3>
            <p className="text-sm leading-relaxed text-gray-200">
              To provide fast, intelligent, and reliable emergency assistance
              using AI and real-time technologies to reduce response time and
              save lives. We aim to empower users with instant reporting,
              accurate analysis, and timely support when every second matters.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#f3f4f6] py-14 px-16 flex justify-between">
        {/* Left */}
        <div className="w-1/2">
          <h2 className="text-teal-500 text-5xl font-semibold mb-6 tracking-wide">
            CONTACT US
          </h2>

          <h3 className="text-red-600 text-2xl font-semibold mb-2">
            Get in Touch
          </h3>

          <p className="text-gray-700 text-[15px] mb-8 leading-relaxed">
            Have questions, feedback, or need assistance? We’re here to help you
            stay safe and informed.
          </p>

          {/* Stars */}
          <div className="flex gap-4 text-3xl text-gray-600">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i}>☆</span>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="w-1/2 text-gray-800 text-[16px] space-y-4 mt-16">
          <p>✉ Email: support@aeris.com</p>
          <p>☎ Phone: +91 98765 43210</p>
          <p>
            ⌂ Address: Model Engineering College, Thrikkakara, Kerala, India
          </p>
        </div>
      </section>
    </div>
  );
}
