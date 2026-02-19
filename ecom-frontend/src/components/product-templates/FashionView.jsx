import { useState } from "react";
import { FaHeart, FaShareAlt, FaShoppingCart, FaStar, FaRegStar } from "react-icons/fa";

export default function FashionView({ product, allImages, selectedImage, setSelectedImage, handleQuantityChange, quantity, handleAddToCart, isAvailable }) {
    const [selectedSize, setSelectedSize] = useState("M");
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Vertical Image Gallery */}
            <div className="flex flex-col-reverse lg:flex-row gap-4">
                {/* Thumbnails (Vertical on Desktop) */}
                <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:h-[600px] scrollbar-hide py-2 lg:py-0">
                    {allImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all
                ${selectedImage === index ? "border-indigo-600 opacity-100" : "border-gray-200 opacity-70 hover:opacity-100"}`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>

                {/* Main Image */}
                <div className="flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-sm relative">
                    <img
                        src={allImages[selectedImage]}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                    />
                    {product.discount > 0 && (
                        <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                            {product.discount}% OFF
                        </span>
                    )}
                </div>
            </div>

            {/* Right: Info & Actions */}
            <div className="space-y-8 lg:py-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">{product.productName}</h1>
                    <p className="text-gray-500">{product.brand || "Generic"}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                i < Math.floor(product.rating || 0) ? <FaStar key={i} /> : <FaRegStar key={i} />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500 hover:text-indigo-600 cursor-pointer underline decoration-dotted">
                            {product.reviewCount || 0} reviews
                        </span>
                    </div>
                </div>

                <div className="flex items-baseline gap-4">
                    {product.specialPrice ? (
                        <>
                            <span className="text-4xl font-light text-gray-900">₹{Number(product.specialPrice).toFixed(0)}</span>
                            <span className="text-xl text-gray-400 line-through font-light">₹{Number(product.price).toFixed(0)}</span>
                        </>
                    ) : (
                        <span className="text-4xl font-light text-gray-900">₹{Number(product.price).toFixed(0)}</span>
                    )}
                </div>

                {/* Size Selector */}
                <div>
                    <div className="flex justify-between mb-3">
                        <span className="font-medium text-gray-900">Select Size</span>
                        <button className="text-indigo-600 text-sm font-medium hover:underline">Size Guide</button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {sizes.map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-medium transition-all
                            ${selectedSize === size
                                        ? "bg-gray-900 text-white shadow-lg"
                                        : "bg-white border text-gray-900 hover:border-gray-900"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-gray-200" />

                <p className="text-gray-600 leading-relaxed font-light">
                    {product.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <div className="flex items-center border border-gray-300 rounded-full px-4 h-14">
                        <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-2 text-gray-500 hover:text-black">-</button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.quantity} className="p-2 text-gray-500 hover:text-black">+</button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!isAvailable}
                        className={`flex-1 rounded-full h-14 font-medium text-lg flex items-center justify-center gap-2 shadow-xl transition-transform active:scale-95
                ${isAvailable ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                    >
                        <FaShoppingCart className="text-lg" />
                        {isAvailable ? "Add to Bag" : "Sold Out"}
                    </button>

                    <button className="h-14 w-14 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600">
                        <FaHeart />
                    </button>
                </div>
            </div>
        </div>
    );
}
