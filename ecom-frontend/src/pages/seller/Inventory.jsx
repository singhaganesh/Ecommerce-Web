import React, { useState } from "react";
import {
  FaClipboardList,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaEdit,
  FaTrash
} from "react-icons/fa";
import AddProduct from "./AddProduct";

/* ---------- Static Stats ---------- */
const stats = {
  total: 1248,
  totalChange: "+12% from last month",
  outOfStock: 12,
  outOfStockChange: "-2 since yesterday",
  lowStock: 45,
  lowStockChange: "Requires attention",
};

/* ---------- Static Products ---------- */
const products = [
  {
    id: 1,
    name: "Apple Watch Series 9",
    sku: "AW-001",
    category: "Smart Watches",
    price: 399.99,
    stock: 25,
    status: "Active",
    image: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f"
  },
  {
    id: 2,
    name: "Samsung Galaxy Watch 6",
    sku: "SGW-002",
    category: "Smart Watches",
    price: 299.99,
    stock: 18,
    status: "Active",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
  },
  {
    id: 3,
    name: "Noise ColorFit Pro 4",
    sku: "NCF-003",
    category: "Smart Watches",
    price: 89.99,
    stock: 5,
    status: "Low Stock",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1"
  },
  {
    id: 4,
    name: "Boat Xtend Smart Watch",
    sku: "BXT-004",
    category: "Smart Watches",
    price: 59.99,
    stock: 0,
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d"
  },
    {
    id: 1,
    name: "Apple Watch Series 9",
    sku: "AW-001",
    category: "Smart Watches",
    price: 399.99,
    stock: 25,
    status: "Active",
    image: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f"
  },
  {
    id: 2,
    name: "Samsung Galaxy Watch 6",
    sku: "SGW-002",
    category: "Smart Watches",
    price: 299.99,
    stock: 18,
    status: "Active",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
  },
  {
    id: 3,
    name: "Noise ColorFit Pro 4",
    sku: "NCF-003",
    category: "Smart Watches",
    price: 89.99,
    stock: 5,
    status: "Low Stock",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1"
  },
  {
    id: 4,
    name: "Boat Xtend Smart Watch",
    sku: "BXT-004",
    category: "Smart Watches",
    price: 59.99,
    stock: 0,
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d"
  }
];

const Inventory = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 cursor-pointer"
          onClick={() => setShowAddProduct(true)}
        >
          + Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center gap-4">
            <FaClipboardList className="text-blue-500 text-3xl" />
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm text-green-600">{stats.totalChange}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-red-200">
          <div className="flex items-center gap-4">
            <FaExclamationCircle className="text-red-500 text-3xl" />
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
              <p className="text-sm text-red-600">{stats.outOfStockChange}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-yellow-200">
          <div className="flex items-center gap-4">
            <FaExclamationTriangle className="text-yellow-500 text-3xl" />
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.lowStock}</p>
              <p className="text-sm text-yellow-600">{stats.lowStockChange}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">PRODUCT</th>
              <th className="p-4">CATEGORY</th>
              <th className="p-4">PRICE</th>
              <th className="p-4">STOCK</th>
              <th className="p-4">STATUS</th>
              <th className="p-4">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <img src={product.image} className="w-12 h-12 rounded object-cover" />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                </td>

                <td className="p-4">{product.category}</td>
                <td className="p-4">${product.price}</td>
                <td className="p-4">{product.stock}</td>

                <td className="p-4">
                  <span className={`font-medium ${
                    product.status === "Active" ? "text-green-600" :
                    product.status === "Low Stock" ? "text-yellow-600" :
                    "text-red-600"
                  }`}>
                    ● {product.status}
                  </span>
                </td>

                <td className="p-4 flex gap-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t flex justify-between items-center text-sm text-gray-600">
          <p>Showing 1-{products.length} of {stats.total} products</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-100">Previous</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>

      {showAddProduct && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-50 transition-all duration-300"
          onClick={() => setShowAddProduct(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out transform scale-95 animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <AddProduct onClose={() => setShowAddProduct(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
