import ImageGallery from "../product-shared/ImageGallery";
import RatingsReviews from "../product-shared/RatingsReviews";
import PriceSection from "../product-shared/PriceSection";
import AddToCartSection from "../product-shared/AddToCartSection";
import SpecificationsTable from "../product-shared/SpecificationsTable";
import VariantSelector from "../product-shared/VariantSelector";

export default function FashionView({ product, allImages, selectedImage, setSelectedImage, handleQuantityChange, quantity, handleAddToCart, isAvailable }) {

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

                {/* Dynamic Size & Color Selector */}
                <VariantSelector
                    specifications={product.specifications}
                    categoryName={product.categoryName}
                />

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

                {/* Specifications */}
                <SpecificationsTable specifications={product.specifications} title="Product Details" />
            </div>
        </div>
    );
}
