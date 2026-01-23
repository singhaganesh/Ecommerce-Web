import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdInventory,
  MdShoppingCart,
  MdPeople,
  MdBarChart
} from "react-icons/md";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/seller/dashboard", icon: <MdDashboard size={22} /> },
    { name: "Inventory", path: "/seller/inventory", icon: <MdInventory size={22} /> },
    { name: "Orders", path: "/seller/orders", icon: <MdShoppingCart size={22} /> },
    { name: "Customers", path: "/seller/customers", icon: <MdPeople size={22} /> },
    { name: "Reports", path: "/seller/reports", icon: <MdBarChart size={22} /> },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r">
      <div className="p-6 text-xl font-bold border-b">
        Seller Center
      </div>

      <nav className="p-4 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition
               ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
