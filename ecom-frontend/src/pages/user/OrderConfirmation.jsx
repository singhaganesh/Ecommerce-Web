import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaCheckCircle, FaBox, FaHome } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { clearCart } from "../../store/actions/cartActions";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-4xl text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We've received your order and will begin processing it right away.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="text-lg font-semibold text-indigo-600">#{orderId}</p>
          </div>

          <p className="text-sm text-gray-500 mb-8">
            A confirmation email has been sent to your registered email address with your order details.
          </p>

          {/* What Next */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaBox className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Order Processing</p>
                <p className="text-sm text-gray-500">Your order is being prepared for shipping</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaHome className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Delivery</p>
                <p className="text-sm text-gray-500">You'll receive tracking information soon</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/"
              className="block w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="block w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              View My Orders
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at <span className="text-indigo-600">support@shopease.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
