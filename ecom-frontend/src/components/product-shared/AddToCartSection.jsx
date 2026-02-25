import { FaShoppingCart, FaHeart } from "react-icons/fa";

export default function AddToCartSection({
    quantity,
    handleQuantityChange,
    maxQuantity,
    handleAddToCart,
    isAvailable,
    showBuyNow = false
}) {
    return (
        <div className="pt-4 flex flex-col gap-4">
            <div className="flex gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-300 rounded-lg px-2 h-14 bg-white">
                    <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-2 text-gray-500 hover:text-black w-8"
                    >
                        -
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= maxQuantity}
                        className="p-2 text-gray-500 hover:text-black w-8"
                    >
                        +
                    </button>
                </div>

                {/* Add To Cart */}
                <button
                    onClick={handleAddToCart}
                    disabled={!isAvailable}
                    className={`flex-1 rounded-lg h-14 font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95
                    ${isAvailable ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                >
                    <FaShoppingCart className="text-lg" />
                    {isAvailable ? "Add to Cart" : "Out of Stock"}
                </button>

                {/* Wishlist */}
                <button className="h-14 w-14 flex-shrink-0 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600">
                    <FaHeart />
                </button>
            </div>

            {/* Optional Buy Now */}
            {showBuyNow && isAvailable && (
                <button className="w-full py-4 rounded-lg font-bold text-lg border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 flex items-center justify-center gap-2 transition-colors">
                    Buy Now
                </button>
            )}
        </div>
    );
}
