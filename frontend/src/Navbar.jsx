import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between p-4 bg-white shadow">
      <h1 className="font-bold text-lg">AERIS</h1>

      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/emergency">Emergency</Link>
      </div>
    </nav>
  );
}

export default Navbar;