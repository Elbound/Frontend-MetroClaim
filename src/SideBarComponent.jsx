import { Link } from '@tanstack/react-router';
import MetroLogo from './assets/metrodata-electronics--600.png';
import { useAuth } from './hooks/AuthContext';

export default function SideBarComponent() {
  const { isManager } = useAuth();
  return (
    <>
      <div className="flex flex-col space-y-5 w-50 min-h-screen bg-blue-800 shadow-black p-5">
        <div>
          <img src={MetroLogo} alt="Metrodata" />
        </div>
        <div>Your role is: {isManager ? 'Manager' : 'Employee'}</div>
        <div className="flex flex-col">
          <Link to="/login" className="p-3 rounded-lg hover:bg-blue-100  hover:text-white">
            Login
          </Link>
          <Link to="/dashboard" className="p-3 rounded-lg hover:bg-blue-100 hover:text-white">
            Dashboard
          </Link>
          <Link to="/reimbursement" className="p-3 rounded-lg hover:bg-blue-100  hover:text-white">
            Reimbursement
          </Link>
          <Link to="/history" className="p-3 rounded-lg hover:bg-blue-100  hover:text-white">
            History
          </Link>

          {isManager && (
            <Link to="/trip" className="p-3 rounded-lg hover:bg-blue-100  hover:text-white">
              Create Trip
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
