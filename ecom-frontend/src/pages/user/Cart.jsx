import { useState } from "react";
import { Link } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash, FaShoppingBag } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateCartQuantity, clearCart } from "../../store/actions/cartActions";
import { useAuth } from "../../context/AuthContext";

export default function Cart() {
  const dispatch = useDispatch();
  const { cartItems, cartTotal } = useSelector((state) => state.cart);
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleQuantityChange = (item, delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity > 0 && newQuantity <= item.maxQuantity) {
      dispatch(updateCartQuantity(item.productId, newQuantity));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
    }
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "save10") {
      setDiscount(cartTotal * 0.1);
    } else if (couponCode.toLowerCase() === "save20") {
      setDiscount(cartTotal * 0.2);
    } else {
      alert("Invalid coupon code");
      setDiscount(0);
    }
  };

  const shippingCost = cartTotal > 500 ? 0 : 50;
  const finalTotal = cartTotal - discount + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShoppingBag className="text-4xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-4 hidden md:grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Items */}
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-lg shadow p-4 md:grid grid-cols-12 gap-4 items-center"
              >
                {/* Product Info */}
                <div className="col-span-6 flex gap-4">
                  <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                    <img
                      src={item.primaryImage || item.image}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  </Link>
                  <div>
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-medium text-gray-800 hover:text-indigo-600 line-clamp-2"
                    >
                      {item.productName}
                    </Link>
                    {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                    {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-red-500 hover:text-red-700 text-sm mt-2 flex items-center gap-1"
                    >
                      <FaTrash size={12} />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 text-center md:block hidden">
                  <p className="font-medium">₹{Number(item.price).toFixed(2)}</p>
                </div>

                {/* Quantity */}
                <div className="col-span-2 flex items-center justify-center gap-3 md:mt-0 mt-4">
                  <button
                    onClick={() => handleQuantityChange(item, -1)}
                    disabled={item.quantity <= 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item, 1)}
                    disabled={item.quantity >= item.maxQuantity}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>

                {/* Total */}
                <div className="col-span-2 text-right md:block hidden">
                  <p className="font-bold text-indigo-600">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Mobile View - Price & Total */}
                <div className="md:hidden col-span-12 flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    ₹{Number(item.price).toFixed(2)} × {item.quantity}
                  </div>
                  <div className="font-bold text-indigo-600">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-800 font-medium text-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Try: SAVE10, SAVE20</p>
              </div>

              {/* Summary Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "FREE" : `₹${shippingCost.toFixed(2)}`}</span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-green-600">Free shipping on orders over ₹500</p>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to={isAuthenticated() ? "/checkout" : "/login?redirect=/checkout"}
                className="block w-full py-3 bg-indigo-600 text-white text-center rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                {isAuthenticated() ? "Proceed to Checkout" : "Login to Checkout"}
              </Link>

              {/* Continue Shopping */}
              <Link
                to="/"
                className="block w-full py-3 mt-4 border border-gray-300 text-gray-700 text-center rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
