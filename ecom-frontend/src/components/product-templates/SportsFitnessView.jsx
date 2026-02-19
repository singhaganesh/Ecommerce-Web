import { FaHeart, FaShoppingCart, FaStar, FaRegStar, FaDumbbell, FaStopwatch } from "react-icons/fa";

export default function SportsFitnessView({ product, allImages, selectedImage, setSelectedImage, handleQuantityChange, quantity, handleAddToCart, isAvailable }) {
    return (
        <div className="bg-white rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image (Left) */}
                <div className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                            src={allImages[selectedImage]}
                            alt={product.productName}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2 justify-center">
                        {allImages.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`w-16 h-16 rounded border-2 transition-colors
                            ${selectedImage === index ? "border-red-600" : "border-gray-200 hover:border-gray-400"}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info (Right) */}
                <div>
                    <div className="border-b-4 border-red-600 pb-4 mb-6 inline-block">
                        <h1 className="text-3xl md:text-4xl font-extrabold uppercase italic tracking-tighter text-gray-900">
                            {product.productName}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-2xl font-bold text-red-600">₹{Number(product.specialPrice || product.price).toFixed(0)}</span>
                        <div className="flex gap-1 text-yellow-500">
                            <FaStar /> {product.rating} / 5
                        </div>
                    </div>

                    <p className="text-gray-700 font-medium mb-8">
                        {product.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 col-span-2 p-4 rounded border-l-4 border-red-600">
                            <h4 className="font-bold flex items-center gap-2"><FaDumbbell className="text-red-600" /> Build Quality</h4>
                            <p className="text-sm text-gray-600 mt-1">Industrial grade materials designed for high intensity usage.</p>
                        </div>
                        <div className="bg-gray-50 col-span-2 p-4 rounded border-l-4 border-black">
                            <h4 className="font-bold flex items-center gap-2"><FaStopwatch className="text-black" /> Performance</h4>
                            <p className="text-sm text-gray-600 mt-1">Optimized for professionals and enthusiasts alike.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-900">QTY</span>
                            <div className="flex border border-gray-400 rounded">
                                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="px-3 py-2 bg-gray-100 font-bold hover:bg-gray-200">-</button>
                                <span className="px-4 py-2 font-bold">{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.quantity} className="px-3 py-2 bg-gray-100 font-bold hover:bg-gray-200">+</button>
                            </div>
                            {isAvailable ?
                                <span className="text-green-600 font-bold text-sm">IN STOCK</span> :
                                <span className="text-red-600 font-bold text-sm">OUT OF STOCK</span>
                            }
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!isAvailable}
                            className={`w-full py-4 uppercase font-black text-xl tracking-widest transition-transform active:scale-95
                        ${isAvailable ? "bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                        >
                            {isAvailable ? "Add to Cart" : "Unavailable"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
