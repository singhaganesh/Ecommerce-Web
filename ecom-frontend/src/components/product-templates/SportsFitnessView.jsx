import { FaDumbbell, FaStopwatch } from "react-icons/fa";
import ImageGallery from "../product-shared/ImageGallery";
import RatingsReviews from "../product-shared/RatingsReviews";
import PriceSection from "../product-shared/PriceSection";
import AddToCartSection from "../product-shared/AddToCartSection";
import SpecificationsTable from "../product-shared/SpecificationsTable";
import VariantSelector from "../product-shared/VariantSelector";

export default function SportsFitnessView({ product, allImages, selectedImage, setSelectedImage, handleQuantityChange, quantity, handleAddToCart, isAvailable }) {
    return (
        <div className="bg-white rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image (Left) */}
                <ImageGallery
                    allImages={allImages}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    productName={product.productName}
                    discount={product.discount}
                    layout="horizontal"
                />

                {/* Info (Right) */}
                <div>
                    <div className="border-b-4 border-red-600 pb-4 mb-6 inline-block">
                        <h1 className="text-3xl md:text-4xl font-extrabold uppercase italic tracking-tighter text-gray-900">
                            {product.productName}
                        </h1>
                        <RatingsReviews rating={product.rating} reviewCount={product.reviewCount} />
                    </div>

                    <div className="mb-6">
                        <PriceSection price={product.price} specialPrice={product.specialPrice} />
                    </div>

                    <p className="text-gray-700 font-medium mb-8">
                        {product.description}
                    </p>

                    {/* Dynamic Size/Color Selector */}
                    <VariantSelector
                        specifications={product.specifications}
                        categoryName={product.categoryName}
                    />

                    <div className="grid grid-cols-2 gap-4 mb-8 mt-6">
                        <div className="bg-gray-50 col-span-2 p-4 rounded border-l-4 border-red-600">
                            <h4 className="font-bold flex items-center gap-2"><FaDumbbell className="text-red-600" /> Build Quality</h4>
                            <p className="text-sm text-gray-600 mt-1">Industrial grade materials designed for high intensity usage.</p>
                        </div>
                        <div className="bg-gray-50 col-span-2 p-4 rounded border-l-4 border-black">
                            <h4 className="font-bold flex items-center gap-2"><FaStopwatch className="text-black" /> Performance</h4>
                            <p className="text-sm text-gray-600 mt-1">Optimized for professionals and enthusiasts alike.</p>
                        </div>
                    </div>

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
            <div className="mt-12">
                <SpecificationsTable specifications={product.specifications} title="Product Specifications" />
            </div>
        </div>
    );
}
