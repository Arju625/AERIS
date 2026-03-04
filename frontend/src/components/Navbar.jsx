import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Features', path: '/features' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="flex justify-between items-center px-[20px] md:px-[60px] py-[30px] bg-transparent gap-[20px] md:gap-[120px] flex-col md:flex-row relative z-10">
      <div className="flex items-center gap-[15px] cursor-pointer" onClick={() => navigate('/')}>
        <img src="/assets/logo.svg" alt="Aeris Logo" className="h-[40px] object-contain" />
        <h1 className="text-[1.6rem] font-extrabold text-text-dark tracking-[0.5px] border-l-2 border-text-dark pl-[15px]">AERIS</h1>
      </div>

      <div className="flex items-center bg-white py-[8px] pr-[12px] pl-[15px] md:pl-[50px] rounded-[50px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] justify-between flex-1 w-full md:w-auto gap-[15px] md:gap-[30px]">
        <ul className="flex list-none gap-[20px] md:gap-[80px] p-0 m-0 items-center overflow-x-auto">
          {NAV_ITEMS.map(({ label, path }) => {
            const isActive = pathname === path;
            return (
              <li
                key={path}
                onClick={() => navigate(path)}
                className={`text-[1.1rem] font-semibold cursor-pointer relative transition-colors ${
                  isActive
                    ? "text-primary-red after:content-[''] after:absolute after:left-0 after:-bottom-[4px] after:w-full after:h-[3px] after:bg-primary-red after:rounded-[2px]"
                    : 'text-text-dark hover:text-primary-red'
                }`}
              >
                {label}
              </li>
            );
          })}
        </ul>

        <div className="flex gap-[15px]">
          <button
            onClick={() => navigate('/auth', { state: { tab: 'login' } })}
            className="border-none rounded-[30px] px-[28px] py-[12px] text-[1rem] font-semibold text-white cursor-pointer transition-all hover:-translate-y-[2px] hover:opacity-90 bg-primary-teal"
          >
            login
          </button>
          <button
            onClick={() => navigate('/auth', { state: { tab: 'signup' } })}
            className="border-none rounded-[30px] px-[28px] py-[12px] text-[1rem] font-semibold text-white cursor-pointer transition-all hover:-translate-y-[2px] hover:opacity-90 bg-primary-red whitespace-nowrap"
          >
            Create Account
          </button>
        </div>
      </div>
    </nav>
  );
}
