import { useState } from 'react';

/* ── Inline SVG Icons ── */
function HomeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}
function HistoryIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function SearchIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function BellIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function HeartIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function ChevronRight({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function DotsIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

/* ── Quick Access Cards Data ── */
const QUICK_ACCESS = [
  { icon: '/assets/emergency.svg', title: 'Emergency History', sub: 'View Past Report' },
  { icon: '/assets/firstaid.svg', title: 'First Aid', sub: 'Quick Medical Steps' },
  { icon: '/assets/location.svg', title: 'Nearby Services', sub: 'Find Hospitals' },
  { icon: '/assets/status.svg', title: 'Status', sub: 'Track Active Status' },
];

const ACTIVITY_ROWS = [
  { incident: 'Fire', id: 'AIR123', status: 'Resolved', date: 'Apr 22, 8:41 PM' },
  { incident: 'Medical', id: 'AIR134', status: 'Resolved', date: 'Apr 22, 4:41 PM' },
  { incident: 'Fire', id: 'AIR123', status: 'Resolved', date: 'Apr 23, 8:41 AM' },
];

/* ── Sidebar Nav Items ── */
const NAV = [
  { id: 'home', label: 'Home', icon: <HomeIcon /> },
  { id: 'alerts', label: 'Alerts', icon: <img src="/assets/horn.svg" className="w-5 h-5 object-contain" alt="" /> },
  { id: 'history', label: 'History', icon: <HistoryIcon /> },
  { id: 'profile', label: 'Profile', icon: <img src="/assets/profile.svg" className="w-5 h-5 object-contain rounded-full" alt="" /> },
  { id: 'more', label: 'More', icon: <DotsIcon /> },
];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('home');

  return (
    <div className="flex h-screen font-montserrat overflow-hidden bg-white">

      {/* ══════════════════ SIDEBAR ══════════════════ */}
      <aside className="w-[270px] flex-shrink-0 bg-primary-teal flex flex-col py-7 px-5 overflow-y-auto">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <img src="/assets/logo.svg" alt="Aeris" className="h-9 object-contain" />
          <span className="text-[1.4rem] font-extrabold text-white border-l-2 border-white pl-3 leading-none">AERIS</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer w-full ${
                activeNav === id
                  ? 'bg-white text-text-dark shadow-sm'
                  : 'text-gray-900 hover:bg-white/20'
              }`}
            >
              {icon}
              <span className="font-semibold text-[0.95rem]">{label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Shortcut Cards */}
        <div className="flex flex-col gap-3 mt-6">
          {[
            { icon: '/assets/emergency.svg', title: 'Emergency History', sub: 'View Past Report' },
            { icon: '/assets/location.svg', title: 'Nearby Services', sub: 'Find Hospitals' },
          ].map(({ icon, title, sub }) => (
            <div
              key={title}
              className="bg-white/25 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-white/35 transition-colors"
            >
              <img src={icon} alt={title} className="h-11 w-11 object-contain flex-shrink-0" />
              <div>
                <p className="font-bold text-text-dark text-[0.82rem] leading-tight">{title}</p>
                <p className="text-gray-700 text-[0.75rem] mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ══════════════════ MAIN AREA ══════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="flex items-center gap-4 px-8 py-4 border-b border-gray-100 bg-white">
          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
              <SearchIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none flex-1 text-sm text-gray-600 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 ml-auto">
            <button className="bg-primary-red text-white font-bold px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
              Log Out
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img src="/assets/profile.svg" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="relative cursor-pointer text-gray-600 hover:text-gray-900 transition-colors">
              <BellIcon className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="cursor-pointer text-gray-500 hover:text-primary-red transition-colors">
              <HeartIcon className="w-6 h-6" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-8 py-6 bg-white">

          {/* Greeting */}
          <h1 className="text-[1.5rem] font-bold text-text-dark mb-0.5">Hello Hridhya! 👋</h1>
          <p className="text-gray-400 text-sm mb-5">Stay Safe Today</p>

          {/* Report Emergency Button */}
          <button className="w-full bg-primary-red text-white font-bold text-[1.05rem] py-4 rounded-2xl flex items-center justify-center gap-4 mb-6 hover:opacity-95 transition-opacity shadow-sm">
            <img src="/assets/emergencycall.svg" alt="Emergency Call" className="h-8 w-8 object-contain" />
            Report Emergency
          </button>

          {/* Quick Access */}
          <p className="font-semibold text-text-dark text-[0.95rem] mb-3">Quick Access</p>
          <div className="flex gap-4 mb-6">

            {/* 2×2 cards */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              {QUICK_ACCESS.map(({ icon, title, sub }) => (
                <div
                  key={title}
                  className="bg-gray-100 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <img src={icon} alt={title} className="h-10 w-10 object-contain flex-shrink-0" />
                  <div>
                    <p className="font-bold text-text-dark text-[0.82rem] leading-tight">{title}</p>
                    <p className="text-gray-400 text-[0.72rem] mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Case */}
            <div className="w-[260px] flex-shrink-0 bg-gray-100 rounded-2xl p-5 flex flex-col">
              <p className="font-bold text-text-dark text-[0.95rem] mb-2">Active Case</p>
              <div className="flex-1 flex flex-col items-center justify-center py-2">
                <img src="/assets/horn.svg" alt="No Emergency" className="h-14 w-14 object-contain opacity-50 mb-3" />
                <p className="text-gray-400 text-[0.82rem] font-medium text-center">No Active Emergencies</p>
              </div>
              <div className="flex justify-end mt-2">
                <span className="text-[0.72rem] text-gray-400 cursor-pointer hover:text-primary-red transition-colors">
                  View All History
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-2 gap-6">

            {/* Left: Incident Card + Timeline */}
            <div>
              {/* Accident Card */}
              <div className="bg-gray-100 rounded-2xl p-4 mb-3">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/assets/accident.svg" alt="Accident" className="h-12 w-12 object-contain flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-primary-red text-[0.95rem]">Accident</p>
                      <span className="bg-gray-700 text-white text-[0.7rem] font-bold px-3 py-1 rounded-full flex-shrink-0">
                        Ongoing
                      </span>
                    </div>
                    <p className="text-gray-400 text-[0.75rem] mt-0.5">April 23, 3.45 PM</p>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-primary-red rounded-full" />
                </div>
              </div>

              {/* Timeline */}
              <div className="flex flex-col gap-2">
                <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm cursor-pointer hover:border-gray-200 transition-colors">
                  <img src="/assets/ambulance.svg" alt="Ambulance" className="h-9 w-9 object-contain flex-shrink-0" />
                  <span className="flex-1 font-semibold text-text-dark text-[0.85rem]">Ambulance Assigned</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm cursor-pointer hover:border-gray-200 transition-colors">
                  <img src="/assets/horn.svg" alt="Case" className="h-9 w-9 object-contain flex-shrink-0" />
                  <span className="flex-1 font-semibold text-text-dark text-[0.85rem]">Case Closed</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Right: Recent Activity Table */}
            <div>
              <h3 className="font-bold text-text-dark text-[0.95rem] mb-4">Recent  Activity</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left font-bold text-text-dark pb-3 pr-3 text-[0.82rem]">Incident</th>
                    <th className="text-left font-bold text-text-dark pb-3 pr-3 text-[0.82rem]">Case Id</th>
                    <th className="text-left font-bold text-text-dark pb-3 pr-3 text-[0.82rem]">Status</th>
                    <th className="text-left font-bold text-text-dark pb-3 text-[0.82rem]">Date &amp;Time</th>
                  </tr>
                </thead>
                <tbody>
                  {ACTIVITY_ROWS.map((row, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="py-2.5 pr-3 text-gray-500 text-[0.82rem]">{row.incident}</td>
                      <td className="py-2.5 pr-3 text-gray-500 text-[0.82rem]">{row.id}</td>
                      <td className="py-2.5 pr-3 text-gray-500 text-[0.82rem]">{row.status}</td>
                      <td className="py-2.5 text-gray-500 text-[0.82rem]">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
