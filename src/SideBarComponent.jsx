import { Link } from '@tanstack/react-router';
import MetroLogo from './assets/metrodata-electronics--600.png';

export default function SideBarComponent() {
  return (
    <>
      <div className="flex flex-col space-y-5 w-50 min-h-screen bg-blue-800 shadow-black p-5">
        <div>
            <img src={MetroLogo} alt="Metrodata" />
        </div>
        <div className="flex flex-col">
            <Link to="/dashboard" className="p-3 rounded-lg hover:bg-blue-100 hover:text-white">
            Dashboard
            </Link>

            <Link to="/login" className="p-3 rounded-lg hover:bg-blue-100  hover:text-white">
            Login
            </Link>

            <Link to="/test2" className="p-3 rounded-lg hover:bg-blue-100  hover:text-white">
            test2
            </Link>
        </div>
        
      </div>
    </>
  );
}
