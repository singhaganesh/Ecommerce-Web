import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaCreditCard, FaLock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { clearCart } from "../../store/actions/cartActions";
import api from "../../api/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, cartTotal } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.userName || "",
    email: user?.email || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const validateAddress = () => {
    const required = ["fullName", "email", "phone", "addressLine1", "city", "state", "pincode"];
    return required.every(field => shippingAddress[field]?.trim());
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: user?.id,
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          landmark: shippingAddress.landmark,
          phone: shippingAddress.phone
        },
        paymentMethod: paymentMethod,
        totalAmount: cartTotal
      };

      const response = await api.post("/orders", orderData);
      
      dispatch(clearCart());
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${response.data.orderId}`);

    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const shippingCost = cartTotal > 500 ? 0 : 50;
  const finalTotal = cartTotal + shippingCost;

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  if (!isAuthenticated()) {
    navigate("/login?redirect=/checkout");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
              ${step >= 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}>
              1
            </div>
            <span className="ml-2 font-medium">Shipping</span>
          </div>
          <div className={`w-16 h-1 mx-4 ${step >= 2 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
              ${step >= 2 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}>
              2
            </div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-indigo-600" />
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingAddress.email}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={shippingAddress.addressLine1}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="House/Flat number, Street name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={shippingAddress.addressLine2}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Area, Colony (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingAddress.pincode}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      maxLength="6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                    <input
                      type="text"
                      name="landmark"
                      value={shippingAddress.landmark}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nearby landmark (optional)"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!validateAddress()}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaCreditCard className="text-indigo-600" />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  {/* COD */}
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive the order</p>
                    </div>
                    <div className="text-2xl">💵</div>
                  </label>

                  {/* Card */}
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-gray-500">Pay using Visa, Mastercard, RuPay</p>
                    </div>
                    <div className="text-2xl">💳</div>
                  </label>

                  {/* UPI */}
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium">UPI</p>
                      <p className="text-sm text-gray-500">Pay using Google Pay, PhonePe, Paytm</p>
                    </div>
                    <div className="text-2xl">📱</div>
                  </label>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {loading ? "Processing..." : `Place Order - ₹${finalTotal.toFixed(2)}`}
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <FaLock />
                  <span>Secure checkout powered by ShopEase</span>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <img
                      src={item.primaryImage || item.image}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-2">{item.productName}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="font-semibold text-indigo-600">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "FREE" : `₹${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
