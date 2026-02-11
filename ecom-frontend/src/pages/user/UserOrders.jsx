import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaBox, FaTruck, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export default function UserOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/orders/user/${user?.id}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <FaClock className="text-yellow-500" />;
      case "CONFIRMED":
        return <FaCheckCircle className="text-blue-500" />;
      case "SHIPPED":
        return <FaTruck className="text-purple-500" />;
      case "DELIVERED":
        return <FaBox className="text-green-500" />;
      case "CANCELLED":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBox className="text-4xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold">#{order.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {new Date(order.orderDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-semibold">₹{Number(order.totalAmount).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(selectedOrder === order.orderId ? null : order.orderId)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1"
                  >
                    <FaEye />
                    {selectedOrder === order.orderId ? "Hide Details" : "View Details"}
                  </button>
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder === order.orderId && (
                <div className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Items Ordered</h3>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <img
                            src={item.productImage || "https://via.placeholder.com/100"}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.productName}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{Number(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
                    <p className="text-gray-600">
                      {order.shippingAddress?.fullName}, {order.shippingAddress?.addressLine1},
                      {order.shippingAddress?.addressLine2 && ` ${order.shippingAddress.addressLine2},`}
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>
                    <p className="text-gray-600 mt-1">Phone: {order.shippingAddress?.phone}</p>
                  </div>

                  {/* Payment Info */}
                  <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium capitalize">{order.paymentMethod?.replace("_", " ")}</p>
                    </div>
                    {order.status !== "DELIVERED" && order.paymentMethod === "COD" && (
                      <p className="text-sm text-gray-500">
                        Pay ₹{Number(order.totalAmount).toFixed(2)} on delivery
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
