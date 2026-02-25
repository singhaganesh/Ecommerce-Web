import { FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import ImageGallery from "../product-shared/ImageGallery";
import RatingsReviews from "../product-shared/RatingsReviews";
import PriceSection from "../product-shared/PriceSection";
import AddToCartSection from "../product-shared/AddToCartSection";

export default function ElectronicsView({ product, allImages, selectedImage, setSelectedImage, handleQuantityChange, quantity, handleAddToCart, isAvailable }) {
    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                {/* Gallery (Left Col-7) */}
                <div className="lg:col-span-7">
                    <ImageGallery
                        allImages={allImages}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        productName={product.productName}
                        discount={product.discount}
                        layout="horizontal"
                    />
                </div>

                {/* Info (Right Col-5) */}
                <div className="lg:col-span-5 space-y-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.productName}</h1>
                        <RatingsReviews rating={product.rating} reviewCount={product.reviewCount} />
                    </div>

                    <PriceSection price={product.price} specialPrice={product.specialPrice} />

                    {/* Technical Highlights */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col p-3 bg-white border rounded-lg text-center shadow-sm">
                            <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Warranty</span>
                            <span className="font-semibold text-gray-900">1 Year</span>
                        </div>
                        <div className="flex flex-col p-3 bg-white border rounded-lg text-center shadow-sm">
                            <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Replacement</span>
                            <span className="font-semibold text-gray-900">7 Days</span>
                        </div>
                    </div>

                    {/* Main Action */}
                    <AddToCartSection
                        quantity={quantity}
                        handleQuantityChange={handleQuantityChange}
                        maxQuantity={product.quantity}
                        handleAddToCart={handleAddToCart}
                        isAvailable={isAvailable}
                        showBuyNow={true}
                    />

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
