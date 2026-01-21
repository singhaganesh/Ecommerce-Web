import { FaShoppingCart, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar() {
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

          {/* Login */}
          <Link
            to="/login"
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
          >
            <FaUser />
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
