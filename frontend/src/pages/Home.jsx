import Navbar from '../components/Navbar';
import '../index.css';
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full relative flex flex-col font-montserrat overflow-x-hidden bg-white text-text-dark">

      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[80vw] h-[80vh] bg-[radial-gradient(circle_at_top_right,rgba(162,237,235,0.4)_0%,rgba(255,255,255,0)_60%)] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[80vw] h-[80vh] bg-[radial-gradient(circle_at_bottom_left,rgba(240,160,160,0.4)_0%,rgba(255,255,255,0)_60%)] -z-10"></div>

      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-between px-[20px] md:px-[60px] max-w-[1600px] mx-auto w-full text-center md:text-left">

        <div className="flex-1 md:max-w-[45%] flex flex-col items-center md:items-start mb-[40px]">
          <img src="/assets/logo.svg" alt="Aeris Icon" className="h-[80px] mb-[20px]" />

          <h2 className="text-[1.5rem] font-extrabold">HELLO WORLD!</h2>
          <h1 className="text-[4rem] lg:text-[6.5rem] font-black text-primary-red">
            MEET AERIS
          </h1>

          <h3 className="text-[1.5rem] font-bold mb-[40px]">
            SMART EMERGENCY RESPONSE SYSTEM
          </h3>

          <button
            onClick={() => navigate("/emergency")}
            className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600"
          >
            🚨 Report Emergency
          </button>
        </div>

        <div className="flex-1 flex justify-center">
          <img src="/assets/landing.svg" alt="Illustration" />
        </div>

      </main>
    </div>
  );
}

export default Home;
