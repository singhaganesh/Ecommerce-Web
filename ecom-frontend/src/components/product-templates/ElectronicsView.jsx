import { FaHeart, FaShareAlt, FaShoppingCart, FaStar, FaRegStar, FaCheckCircle, FaShieldAlt } from "react-icons/fa";

export default function ElectronicsView({ product, allImages, selectedImage, setSelectedImage, handleQuantityChange, quantity, handleAddToCart, isAvailable }) {
    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                {/* Gallery (Left Col-7) */}
                <div className="lg:col-span-7 grid grid-cols-1 gap-4">
                    <div className="aspect-video bg-white rounded-xl border p-8 flex items-center justify-center relative overflow-hidden">
                        <img
                            src={allImages[selectedImage]}
                            alt={product.productName}
                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                        />
                        {product.discount > 0 && (
                            <span className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                Save {product.discount}%
                            </span>
                        )}
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {allImages.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`flex-shrink-0 w-24 h-24 bg-white rounded-lg border-2 p-2 flex items-center justify-center transition-all
                            ${selectedImage === index ? "border-indigo-600" : "border-gray-200 hover:border-gray-300"}`}
                            >
                                <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info (Right Col-5) */}
                <div className="lg:col-span-5 space-y-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.productName}</h1>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center bg-green-100 px-2 py-0.5 rounded text-green-700 font-bold text-sm gap-1">
                                {product.rating} <FaStar size={12} />
                            </div>
                            <span className="text-gray-500 text-sm">{product.reviewCount} Ratings & Reviews</span>
                        </div>
                    </div>

                    <div className="space-y-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-gray-900">₹{Number(product.specialPrice || product.price).toFixed(0)}</span>
                            {product.specialPrice && (
                                <span className="text-lg text-gray-400 line-through">₹{Number(product.price).toFixed(0)}</span>
                            )}
                        </div>
                        <p className="text-green-600 text-sm font-medium">Inclusive of all taxes</p>
                    </div>

                    {/* Technical Highlights */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col p-3 bg-white border rounded-lg text-center">
                            <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Warranty</span>
                            <span className="font-semibold text-gray-900">1 Year</span>
                        </div>
                        <div className="flex flex-col p-3 bg-white border rounded-lg text-center">
                            <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Replacement</span>
                            <span className="font-semibold text-gray-900">7 Days</span>
                        </div>
                    </div>

                    {/* Main Action */}
                    <div className="pt-4 flex flex-col gap-3">
                        <button
                            onClick={handleAddToCart}
                            disabled={!isAvailable}
                            className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2
                        ${isAvailable ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                        >
                            <FaShoppingCart />
                            {isAvailable ? "ADD TO CART" : "OUT OF STOCK"}
                        </button>
                        <button className="w-full py-4 rounded-lg font-bold text-lg border-2 border-orange-500 text-orange-600 hover:bg-orange-50 flex items-center justify-center gap-2">
                            BUY NOW
                        </button>
                    </div>

                    {/* Safety/Trust */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 justify-center">
                        <span className="flex items-center gap-1"><FaShieldAlt /> Secure Transaction</span>
                        <span className="flex items-center gap-1"><FaCheckCircle /> Verified Seller</span>
                    </div>
                </div>
            </div>

            {/* Specs Table */}
            <div className="bg-white rounded-xl border p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                    {product.specifications ? (
                        Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="flex border-b border-gray-100 py-3">
                                <span className="text-gray-500 w-1/3 text-sm">{key}</span>
                                <span className="text-gray-900 font-medium w-2/3">{value}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 italic">No specifications listed.</p>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Product Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
        </div>
    );
}
