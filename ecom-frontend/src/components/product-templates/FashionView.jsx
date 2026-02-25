import { useState } from "react";
import ImageGallery from "../product-shared/ImageGallery";
import RatingsReviews from "../product-shared/RatingsReviews";
import PriceSection from "../product-shared/PriceSection";
import AddToCartSection from "../product-shared/AddToCartSection";

export default function FashionView({ product, allImages, selectedImage, setSelectedImage, handleQuantityChange, quantity, handleAddToCart, isAvailable }) {
    const [selectedSize, setSelectedSize] = useState("M");
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Vertical Image Gallery */}
            <ImageGallery
                allImages={allImages}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                productName={product.productName}
                discount={product.discount}
                layout="vertical"
            />

            {/* Right: Info & Actions */}
            <div className="space-y-8 lg:py-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">{product.productName}</h1>
                    <p className="text-gray-500">{product.brand || "Generic"}</p>
                    <RatingsReviews rating={product.rating} reviewCount={product.reviewCount} />
                </div>

                <PriceSection price={product.price} specialPrice={product.specialPrice} />

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
                <AddToCartSection
                    quantity={quantity}
                    handleQuantityChange={handleQuantityChange}
                    maxQuantity={product.quantity}
                    handleAddToCart={handleAddToCart}
                    isAvailable={isAvailable}
                />
            </div>
        </div>
    );
}
