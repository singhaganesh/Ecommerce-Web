import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/actions/authActions";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <h2 className="font-semibold text-lg">Seller Panel</h2>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search orders, SKU..."
          className="border rounded-lg px-3 py-2"
        />
        
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.userName || user?.email || 'User'}</p>
            <p className="text-xs text-gray-500">
              {user?.roles?.includes('ROLE_ADMIN') ? 'Admin' : 
               user?.roles?.includes('ROLE_SELLER') ? 'Seller' : 'User'}
            </p>
          </div>
          
          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {(user?.userName || user?.email || 'U')[0].toUpperCase()}
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="ml-2 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
