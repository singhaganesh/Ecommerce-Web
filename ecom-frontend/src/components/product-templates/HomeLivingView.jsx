import { FaHeart, FaRulerCombined, FaBoxOpen } from "react-icons/fa";
import ImageGallery from "../product-shared/ImageGallery";
import RatingsReviews from "../product-shared/RatingsReviews";
import PriceSection from "../product-shared/PriceSection";
import AddToCartSection from "../product-shared/AddToCartSection";
import SpecificationsTable from "../product-shared/SpecificationsTable";
import VariantSelector from "../product-shared/VariantSelector";

export default function HomeLivingView({ product, allImages, selectedImage, setSelectedImage, handleQuantityChange, quantity, handleAddToCart, isAvailable }) {
    return (
        <div className="space-y-12">
            {/* Wide Hero Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-9">
                    <ImageGallery
                        allImages={allImages}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        productName={product.productName}
                        discount={product.discount}
                        layout="vertical"
                    />
                </div>

                {/* Sticky Summary Info */}
                <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
                    <div>
                        <p className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-2">{product.categoryName}</p>
                        <h1 className="text-3xl font-serif text-gray-900">{product.productName}</h1>
                        <RatingsReviews rating={product.rating} reviewCount={product.reviewCount} />
                    </div>

                    <div className="py-4 border-t border-b border-gray-100">
                        <PriceSection price={product.price} specialPrice={product.specialPrice} />
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-4 mt-4">
                            {product.description}
                        </p>
                    </div>

                    {/* Color Variant if available */}
                    <VariantSelector
                        specifications={product.specifications}
                        categoryName={product.categoryName}
                    />

                    <AddToCartSection
                        quantity={quantity}
                        handleQuantityChange={handleQuantityChange}
                        maxQuantity={product.quantity}
                        handleAddToCart={handleAddToCart}
                        isAvailable={isAvailable}
                    />
                </div>
            </div>

            {/* Dynamic Specifications */}
            <SpecificationsTable specifications={product.specifications} title="Product Details" />

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-12">
                <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-indigo-600">
                        <FaRulerCombined size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Dimensions & Fit</h3>
                    <p className="text-gray-500 text-sm">Perfectly sized for modern spaces. Check specs for exact measures.</p>
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
