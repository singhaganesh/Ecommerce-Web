import { FaShoppingCart, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/actions/authActions";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          ShopEase
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 mx-8">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none"
          />
          <button className="bg-indigo-600 text-white px-6 rounded-r-lg">
            Search
          </button>
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-6">

          {/* Categories */}
          <select className="border border-gray-300 rounded-lg px-3 py-2 hidden md:block">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home</option>
            <option>Books</option>
          </select>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-2xl text-gray-700" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
              0
            </span>
          </Link>

          {/* User Menu - Show based on authentication */}
          {isAuthenticated() ? (
            <div className="flex items-center gap-4">
              {/* Show user name */}
              <span className="text-gray-700 hidden md:block">
                Hi, {user?.userName || 'User'}
              </span>
              
              {/* Seller Dashboard Link - Only for sellers */}
              {user?.roles?.includes('ROLE_SELLER') && (
                <Link
                  to="/seller/dashboard"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Seller Panel
                </Link>
              )}
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600"
              >
                <FaUser />
                Logout
              </button>
            </div>
          ) : (
            /* Login Button - Only when not authenticated */
            <Link
              to="/login"
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
            >
              <FaUser />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
