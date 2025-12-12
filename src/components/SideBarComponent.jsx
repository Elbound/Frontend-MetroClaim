import { Link } from '@tanstack/react-router';
import MetroLogo from '../assets/metrodata-electronics--600.png';
import { useAuth } from '../hooks/AuthContext';

export default function SideBarComponent() {
  const { isManager, isFinance, logout } = useAuth();
  const linkClass = 'p-3 rounded-lg hover:bg-blue-100 hover:text-blue-800';

  return (
    <>
      <div className="sticky top-0 flex flex-col space-y-5 w-full min-h-screen overflow-y-auto bg-blue-800 shadow-black p-5 text-white">
        <div>
          <img src={MetroLogo} alt="Metrodata" className='w-20 h-auto rounded-full' />
        </div>
        <div>Your role is: {isManager ? 'Manager' : isFinance ? 'Finance' : 'Employee'}</div>
        <div className="flex flex-col">
          <Link to="/dashboard" className={linkClass}>
            Dashboard
          </Link>
          <Link to="/reimbursement" className={linkClass}>
            Reimbursement
          </Link>
          <Link to="/history" className={linkClass}>
            History
          </Link>
          <hr className="border-white my-2" />

          {isManager && (
            <>
              <b className="p-3">Management</b>
              <Link to="/approval/manager" className={linkClass}>
                Manager Approval
              </Link>
              <Link to="/trip" className={linkClass}>
                Trip
              </Link>
              <Link to="/trip/create" className={linkClass}>
                Create Trip
              </Link>
              <hr className="border-white my-2" />
            </>
          )}

          {isFinance && (
            <>
              <b className="p-3">Finance</b>
              <Link to="/approval/finance" className={linkClass}>
                Finance Approval
              </Link>
              <Link to="/trip/finance" className={linkClass}>
                Trip Cost Distribution
              </Link>
              <hr className="border-white my-2" />
            </>
          )}

          <button onClick={logout} className={`${linkClass} text-left`}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
