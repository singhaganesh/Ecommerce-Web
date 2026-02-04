import React, { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaEdit,
  FaTrash,
  FaSortUp,
  FaSortDown
} from "react-icons/fa";
import AddProduct from "./AddProduct";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProducts } from "../../store/actions/productActions";

/* ---------- Static Stats ---------- */
const stats = {
  total: 1248,
  totalChange: "+12% from last month",
  outOfStock: 12,
  outOfStockChange: "-2 since yesterday",
  lowStock: 45,
  lowStockChange: "Requires attention",
};


const Inventory = () => {
  const dispatch = useDispatch();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState("productId");
  const [sortOrder, setSortOrder] = useState("asc");
  const pageSize = 5; // Matches backend default

  const { products, loading, pagination } = useSelector(
    (state) => state.products
  );

  const sellerId = 2; // 🔥 later replace with logged-in seller id

  useEffect(() => {
    dispatch(fetchSellerProducts(sellerId, currentPage, pageSize, sortBy, sortOrder));
  }, [dispatch, sellerId, currentPage, sortBy, sortOrder]);

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (pagination && currentPage < pagination.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
    setCurrentPage(0); // Reset to first page on sort change
  };

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

      {/* Sorting Dropdown */}
      <div className="mb-4 flex gap-4">
        <select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="productId">Sort by ID</option>
          <option value="productName">Sort by Name</option>
          <option value="specialPrice">Sort by Price</option>
          <option value="quantity">Sort by Stock</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 cursor-pointer" onClick={() => handleSort("productName")}>
                PRODUCT {sortBy === "productName" && (sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th className="p-4">CATEGORY</th>
              <th className="p-4 cursor-pointer" onClick={() => handleSort("specialPrice")}>
                PRICE {sortBy === "specialPrice" && (sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th className="p-4 cursor-pointer" onClick={() => handleSort("quantity")}>
                STOCK {sortBy === "quantity" && (sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th className="p-4">STATUS</th>
              <th className="p-4">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.productId} className="border-t hover:bg-gray-50">

                  {/* PRODUCT */}
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={product.primaryImage || "/placeholder.png"}
                      className="w-12 h-12 rounded object-cover"
                      alt={product.productName}
                    />
                    <div>
                      <p className="font-medium">{product.productName}</p>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="p-4">{product.categoryName || "—"}</td>

                  {/* PRICE */}
                  <td className="p-4">₹ {product.specialPrice}</td>

                  {/* STOCK */}
                  <td className="p-4">{product.quantity}</td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span className={`font-medium ${product.quantity === 0
                      ? "text-red-600"
                      : product.quantity < 10
                        ? "text-yellow-600"
                        : "text-green-600"
                      }`}>
                      ● {product.quantity === 0
                        ? "Out of Stock"
                        : product.quantity < 10
                          ? "Low Stock"
                          : "Active"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 flex gap-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>

        {/* Pagination */}
        <div className="p-4 border-t flex justify-between items-center text-sm text-gray-600">
          <p>
            Showing {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, pagination?.totalElements || 0)} of {pagination?.totalElements || 0} products
          </p>

          <div className="flex gap-2">
            <button 
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50" 
              onClick={handlePrevious} 
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <button 
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50" 
              onClick={handleNext} 
              disabled={!pagination || currentPage >= pagination.totalPages - 1}
            >
              Next
            </button>
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
