import { FaHeart, FaShoppingCart, FaStar, FaRegStar, FaRulerCombined, FaBoxOpen } from "react-icons/fa";

export default function HomeLivingView({ product, allImages, selectedImage, setSelectedImage, handleQuantityChange, quantity, handleAddToCart, isAvailable }) {
    return (
        <div className="space-y-12">
            {/* Wide Hero Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Image - Wide */}
                <div className="lg:col-span-8 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <img
                        src={allImages[selectedImage]}
                        alt={product.productName}
                        className="w-full h-[500px] object-cover"
                    />
                </div>

                {/* Thumbnail Strip (Vertical) */}
                <div className="lg:col-span-1 hidden lg:flex flex-col gap-3 h-[500px] overflow-y-auto scrollbar-hide">
                    {allImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-all
                        ${selectedImage === index ? "border-gray-800" : "border-transparent opacity-60 hover:opacity-100"}`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>

                {/* Sticky Summary Info */}
                <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
                    <div>
                        <p className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-2">{product.categoryName}</p>
                        <h1 className="text-3xl font-serif text-gray-900">{product.productName}</h1>
                    </div>

                    <div className="py-4 border-t border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl font-medium text-gray-900">₹{Number(product.specialPrice || product.price).toFixed(0)}</span>
                            <div className="flex items-center gap-1 text-sm bg-gray-100 px-2 py-1 rounded">
                                <FaStar className="text-yellow-500" /> {product.rating}
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">
                            {product.description}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center border border-gray-300 rounded-lg p-1">
                            <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-3 hover:bg-gray-100 rounded">-</button>
                            <span className="flex-1 text-center font-medium">{quantity}</span>
                            <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.quantity} className="p-3 hover:bg-gray-100 rounded">+</button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!isAvailable}
                            className={`w-full py-4 rounded-lg font-bold text-white transition-colors
                        ${isAvailable ? "bg-gray-900 hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"}`}
                        >
                            {isAvailable ? "Add to Cart" : "Out of Stock"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-12">
                <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-indigo-600">
                        <FaRulerCombined size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Dimensions & Fit</h3>
                    <p className="text-gray-500 text-sm">Perfectly sized for modern spaces. Check stats for exact measures.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-indigo-600">
                        <FaBoxOpen size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Quality Material</h3>
                    <p className="text-gray-500 text-sm">Crafted with premium materials for durability and aesthetics.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-indigo-600">
                        <FaHeart size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Care Instructions</h3>
                    <p className="text-gray-500 text-sm">Easy to clean and maintain. Built to last a lifetime.</p>
                </div>
            </div>
        </div>
    );
}
