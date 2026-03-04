import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <div className="min-h-screen w-full relative flex flex-col font-montserrat overflow-x-hidden bg-white text-text-dark">

      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[80vw] h-[80vh] bg-[radial-gradient(circle_at_top_right,rgba(162,237,235,0.4)_0%,rgba(255,255,255,0)_60%)] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[80vw] h-[80vh] bg-[radial-gradient(circle_at_bottom_left,rgba(240,160,160,0.4)_0%,rgba(255,255,255,0)_60%)] -z-10 pointer-events-none"></div>

      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-between px-[20px] md:px-[60px] max-w-[1600px] mx-auto w-full text-center md:text-left relative z-10">

        <div className="flex-1 max-w-full md:max-w-[45%] md:pl-[20px] flex flex-col items-center md:items-start mb-[40px] md:mb-0">
          <img src="/assets/logo.svg" alt="Aeris Icon" className="h-[80px] mb-[20px] object-contain" />
          <h2 className="text-[1.5rem] lg:text-[2rem] font-extrabold text-text-dark mb-[5px] tracking-[-0.5px]">HELLO WORLD!</h2>
          <h1 className="text-[4rem] lg:text-[6.5rem] font-black text-primary-red mb-[10px] leading-[1.1] tracking-[-2px]">MEET AERIS</h1>
          <h3 className="text-[1.5rem] font-bold text-text-dark mb-[40px] max-w-full md:max-w-[80%]">SMART EMERGENCY RESPONSE SYSTEM</h3>

          <div className="flex flex-col md:flex-row items-center gap-[20px]">
            <div className="flex">
              <img src="/assets/group.svg" alt="Users" className="h-[50px] object-contain" />
            </div>
            <p className="text-[0.95rem] text-[#555] leading-[1.5] font-medium">
              Report, track, and receive emergency help<br className="hidden md:block" />
              effortlessly with AERIS.
            </p>
          </div>
        </div>

        <div className="flex-1 flex justify-center md:justify-end items-center">
          <img src="/assets/landing.svg" alt="Emergency Response App Illustration" className="max-w-[100%] md:max-w-[110%] h-auto object-contain" />
        </div>
      </main>
    </div>
  );
}

export default App;
