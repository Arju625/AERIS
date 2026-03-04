import Navbar from '../components/Navbar';

const CARDS = [
  {
    img: '/assets/1.svg',
    title: 'Report Emergencies in Seconds',
    desc: 'Quickly send emergency details with live GPS tracking and notify nearby services instantly.',
  },
  {
    img: '/assets/2.svg',
    title: 'Smart AI Detects the Severity',
    desc: 'Our intelligent system analyzes your report in real-time and prioritizes critical cases automatically.',
  },
  {
    img: '/assets/3.svg',
    title: 'Get Immediate First Aid Support',
    desc: 'Access step-by-step first aid instructions while help is on the way.',
  },
];

export default function Features() {
  return (
    <div className="min-h-screen w-full relative flex flex-col font-montserrat overflow-x-hidden bg-white text-text-dark">

      {/* Background gradients — teal top-right, red/pink bottom-left */}
      <div className="absolute top-0 right-0 w-[80vw] h-[80vh] bg-[radial-gradient(circle_at_top_right,rgba(162,237,235,0.5)_0%,rgba(255,255,255,0)_60%)] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[80vw] h-[80vh] bg-[radial-gradient(circle_at_bottom_left,rgba(240,160,160,0.5)_0%,rgba(255,255,255,0)_60%)] -z-10 pointer-events-none"></div>

      <Navbar />

      {/* Hero */}
      <div className="flex flex-col items-center pt-16 pb-12 relative z-10">
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-4">
          <img src="/assets/logo.svg" alt="Aeris Logo" className="h-[70px] md:h-[100px] object-contain" />
          <h1 className="text-[4rem] md:text-[6rem] font-black text-primary-red tracking-[-2px] leading-none">AERIS</h1>
        </div>
        <p className="text-[1.1rem] md:text-[1.3rem] font-bold text-text-dark mt-2 text-center">
          Report, track, and receive emergency help<br />effortlessly with AERIS.
        </p>
      </div>

      {/* Feature Cards */}
      <main className="flex-1 px-[20px] md:px-[60px] pb-[80px] relative z-10 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 max-w-[1400px] mx-auto w-full">
          {CARDS.map(({ img, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col h-full"
            >
              <div className="h-[300px] md:h-[380px] overflow-hidden">
                <img
                  src={img}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:p-10 flex flex-col gap-4 flex-grow justify-center">
                <h3 className="text-[1.2rem] md:text-[1.5rem] font-extrabold text-primary-red text-center leading-tight px-4">
                  {title}
                </h3>
                <p className="text-[0.95rem] md:text-[1.05rem] text-[#555] text-center leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
