import { FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import ImageGallery from "../product-shared/ImageGallery";
import RatingsReviews from "../product-shared/RatingsReviews";
import PriceSection from "../product-shared/PriceSection";
import AddToCartSection from "../product-shared/AddToCartSection";
import SpecificationsTable from "../product-shared/SpecificationsTable";
import VariantSelector from "../product-shared/VariantSelector";

export default function ElectronicsView({ product, allImages, selectedImage, setSelectedImage, handleQuantityChange, quantity, handleAddToCart, isAvailable, variants, selectedVariant, onVariantChange }) {

    // Extract warranty & replacement from specs, or use defaults
    const warranty = product.specifications?.warranty || "1 Year";
    const replacement = product.specifications?.replacement || "7 Days";

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

                    {/* Technical Highlights — from specs */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col p-3 bg-white border rounded-lg text-center shadow-sm">
                            <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Warranty</span>
                            <span className="font-semibold text-gray-900">{warranty}</span>
                        </div>
                        <div className="flex flex-col p-3 bg-white border rounded-lg text-center shadow-sm">
                            <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Replacement</span>
                            <span className="font-semibold text-gray-900">{replacement}</span>
                        </div>
                    </div>

                    {/* Variant Selector */}
                    <VariantSelector
                        variants={variants}
                        specifications={product.specifications}
                        categoryName={product.categoryName}
                        onVariantChange={onVariantChange}
                    />

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

            {/* Dynamic Specs Table */}
            <SpecificationsTable specifications={product.specifications} title="Technical Specifications" />

            {/* Description */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Product Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
        </div>
    );
}
