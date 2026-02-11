import { useEffect, useState } from "react";
import { FaEye, FaTruck, FaCheck, FaTimes, FaSearch, FaFilter } from "react-icons/fa";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const sellerId = user?.id;
      const response = await api.get(`/orders/seller/${sellerId}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order => 
        order.orderId === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED": return "bg-blue-100 text-blue-800";
      case "PROCESSING": return "bg-indigo-100 text-indigo-800";
      case "SHIPPED": return "bg-purple-100 text-purple-800";
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "ALL" || order.status === filterStatus;
    const matchesSearch = order.orderId.toString().includes(searchTerm) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "PENDING").length,
    shipped: orders.filter(o => o.status === "SHIPPED").length,
    delivered: orders.filter(o => o.status === "DELIVERED").length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Orders", value: stats.total, color: "bg-gray-100" },
          { label: "Pending", value: stats.pending, color: "bg-yellow-100" },
          { label: "Shipped", value: stats.shipped, color: "bg-purple-100" },
          { label: "Delivered", value: stats.delivered, color: "bg-green-100" }
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-lg p-4`}>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      #{order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">{order.customerName || "N/A"}</div>
                      <div className="text-sm text-gray-500">{order.shippingAddress?.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order.orderId ? null : order.orderId)}
                          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {order.status === "PENDING" && (
                          <button
                            onClick={() => updateOrderStatus(order.orderId, "CONFIRMED")}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition"
                            title="Confirm Order"
                          >
                            <FaCheck />
                          </button>
                        )}
                        {order.status === "CONFIRMED" && (
                          <button
                            onClick={() => updateOrderStatus(order.orderId, "SHIPPED")}
                            className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition"
                            title="Mark as Shipped"
                          >
                            <FaTruck />
                          </button>
                        )}
                        {order.status === "SHIPPED" && (
                          <button
                            onClick={() => updateOrderStatus(order.orderId, "DELIVERED")}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition"
                            title="Mark as Delivered"
                          >
                            <FaCheck />
                          </button>
                        )}
                        {(order.status === "PENDING" || order.status === "CONFIRMED") && (
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to cancel this order?")) {
                                updateOrderStatus(order.orderId, "CANCELLED");
                              }
                            }}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                            title="Cancel Order"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {orders.filter(o => o.orderId === selectedOrder).map((order) => (
              <div key={order.orderId}>
                <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
                  <h2 className="text-xl font-bold">Order #{order.orderId}</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    &times;
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Customer Information</h4>
                      <p className="text-gray-600">{order.customerName}</p>
                      <p className="text-gray-600">{order.shippingAddress?.email}</p>
                      <p className="text-gray-600">{order.shippingAddress?.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
                      <p className="text-gray-600">
                        {order.shippingAddress?.fullName}<br />
                        {order.shippingAddress?.addressLine1}<br />
                        {order.shippingAddress?.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                      </p>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                  <div className="space-y-3 mb-6">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.productImage || "https://via.placeholder.com/60"}
                          alt={item.productName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{Number(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₹{Number(order.totalAmount).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => {
                          updateOrderStatus(order.orderId, "CONFIRMED");
                          setSelectedOrder(null);
                        }}
                        className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                      >
                        Confirm Order
                      </button>
                    )}
                    {order.status === "CONFIRMED" && (
                      <button
                        onClick={() => {
                          updateOrderStatus(order.orderId, "SHIPPED");
                          setSelectedOrder(null);
                        }}
                        className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
                      >
                        Mark as Shipped
                      </button>
                    )}
                    {order.status === "SHIPPED" && (
                      <button
                        onClick={() => {
                          updateOrderStatus(order.orderId, "DELIVERED");
                          setSelectedOrder(null);
                        }}
                        className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
