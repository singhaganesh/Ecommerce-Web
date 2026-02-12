// CreateProductForm.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMainCategories, fetchChildrenCategories } from "../../store/actions/categoryActions";
import { createProduct, updateProduct } from "../../store/actions/productActions";
import { useAuth } from "../../context/AuthContext";
import ImageUploader from "../../components/ImageUploader";

export default function AddProduct({ onClose, isEditMode = false, product = null }) {

    const dispatch = useDispatch();
    const { getUserId } = useAuth();
    const { mainCategories, subCategories, microCategories } = useSelector(state => state.category);
    
    const sellerId = getUserId();

    const [mainCategory, setMainCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [microCategory, setMicroCategory] = useState("");

    const [productName, setProductName] = useState("");
    const [brand, setBrand] = useState("");
    const [description, setDescription] = useState("");

    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState(0);
    const [quantity, setQuantity] = useState("");
    const [featured, setFeatured] = useState(false);

    // Images stored as { url: string, publicId: string, isPrimary: boolean }
    const [productImages, setProductImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const specialPrice = price - (price * discount) / 100;

    /* Load main categories and pre-fill data in edit mode */
    useEffect(() => {
        dispatch(fetchMainCategories());
        
        if (isEditMode && product) {
            setProductName(product.productName || "");
            setBrand(product.brand || "");
            setDescription(product.description || "");
            setPrice(product.price !== undefined ? String(product.price) : "");
            setDiscount(product.discount || 0);
            setQuantity(product.quantity !== undefined ? String(product.quantity) : "");
            setFeatured(product.featured || false);
            
            // Convert existing images to new format
            if (product.images && product.images.length > 0) {
                const formattedImages = product.images.map((url, index) => ({
                    url: url,
                    publicId: '',
                    isPrimary: index === 0
                }));
                setProductImages(formattedImages);
            }
        }
    }, [dispatch, isEditMode, product]);

    /* Category Handlers */
    const handleMainChange = (e) => {
        const id = e.target.value;
        setMainCategory(id);
        setSubCategory("");
        setMicroCategory("");
        dispatch(fetchChildrenCategories(id, "sub"));
    };

    const handleSubChange = (e) => {
        const id = e.target.value;
        setSubCategory(id);
        setMicroCategory("");
        dispatch(fetchChildrenCategories(id, "micro"));
    };

    const handleMicroChange = (e) => {
        setMicroCategory(e.target.value);
    };

    const handleImagesUploaded = (images) => {
        setProductImages(images);
    };

    const handlePublish = async () => {
        // Validation
        if (!isEditMode) {
            if (!productName.trim()) {
                alert("Product name is required.");
                return;
            }
            if (!description.trim() || description.length < 6) {
                alert("Description must be at least 6 characters.");
                return;
            }
            if (!price || price <= 0) {
                alert("Valid price is required.");
                return;
            }
            if (!quantity || quantity < 0) {
                alert("Quantity must be 0 or greater.");
                return;
            }
            if (!microCategory) {
                alert("Please select a micro category");
                return;
            }
            if (productImages.length === 0) {
                alert("Please upload at least one product image.");
                return;
            }
        } else {
            if (!description.trim() || description.length < 6) {
                alert("Description must be at least 6 characters.");
                return;
            }
            if (!price || price <= 0) {
                alert("Valid price is required.");
                return;
            }
            if (!quantity || quantity < 0) {
                alert("Quantity must be 0 or greater.");
                return;
            }
        }

        setIsSubmitting(true);

        try {
            // Get primary image URL and gallery URLs
            const primaryImage = productImages.find(img => img.isPrimary);
            const primaryImageUrl = primaryImage ? primaryImage.url : productImages[0].url;
            const galleryUrls = productImages.map(img => img.url);

            const productData = {
                productName: isEditMode ? product.productName : productName,
                brand: isEditMode ? product.brand : brand,
                description,
                price: Number(price),
                discount: Number(discount),
                quantity: Number(quantity),
                specialPrice: Number(specialPrice.toFixed(2)),
                featured: featured,
                primaryImage: primaryImageUrl,
                images: galleryUrls,
            };

            if (isEditMode) {
                await dispatch(updateProduct(
                    product.productId,
                    productData,
                    [],
                    galleryUrls
                ));
            } else {
                await dispatch(createProduct(
                    productData,
                    [],
                    microCategory,
                    sellerId
                ));
            }

            onClose();
        } catch (error) {
            console.error("Failed to save product:", error);
            alert("Failed to save product. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-sm border">
            <h1 className="text-2xl font-bold mb-8 text-gray-800">
                {isEditMode ? "Edit Product" : "Create New Product"}
            </h1>

            {/* 1. Category Selection - Disabled in Edit Mode */}
            {!isEditMode && (
                <section className="mb-10">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</span>
                        Category Selection
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">Provide accurate details to ensure your product is easily discoverable by customers.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Main Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Main Category</label>
                            <select
                                value={mainCategory}
                                onChange={handleMainChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Main Category</option>
                                {mainCategories.map(cat => (
                                    <option key={cat.categoryId} value={cat.categoryId}>
                                        {cat.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sub Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sub Category</label>
                            <select
                                value={subCategory}
                                onChange={handleSubChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Sub Category</option>
                                {subCategories.map(cat => (
                                    <option key={cat.categoryId} value={cat.categoryId}>
                                        {cat.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Micro Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Micro Category</label>
                            <select
                                value={microCategory}
                                onChange={handleMicroChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Micro Category</option>
                                {microCategories.map(cat => (
                                    <option key={cat.categoryId} value={cat.categoryId}>
                                        {cat.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        Selected path:
                        <strong>
                            {" "}
                            {mainCategory && mainCategories.find(c => c.categoryId == mainCategory)?.categoryName}
                            {" → "}
                            {subCategory && subCategories.find(c => c.categoryId == subCategory)?.categoryName}
                            {" → "}
                            {microCategory && microCategories.find(c => c.categoryId == microCategory)?.categoryName}
                        </strong>
                    </div>
                </section>
            )}

            {/* Show category info in edit mode */}
            {isEditMode && product && (
                <section className="mb-10">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-bold">1</span>
                        Category
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">
                            <span className="font-medium">Category:</span> {product.categoryName || "—"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Category cannot be changed after product creation</p>
                    </div>
                </section>
            )}

            {/* 2. Product Information */}
            <section className="mb-10">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full ${isEditMode ? "bg-blue-600" : "bg-blue-600"} text-white flex items-center justify-center text-sm font-bold`}>
                        {isEditMode ? "1" : "2"}
                    </span>
                    Product Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={e => setProductName(e.target.value)}
                            placeholder="e.g. Noise ColorFit Ultra 3 Smartwatch"
                            disabled={isEditMode}
                            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        />
                        {isEditMode && <p className="text-xs text-gray-500 mt-1">Product name cannot be changed</p>}
                    </div>

                    {/* Brand */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand</label>
                        <input
                            type="text"
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                            placeholder="e.g. Noise, boAt, Fire-Boltt"
                            disabled={isEditMode}
                            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        />
                        {isEditMode && <p className="text-xs text-gray-500 mt-1">Brand cannot be changed</p>}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            onWheel={(e) => e.target.blur()}
                            placeholder="e.g. 17999"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Discount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount (%)</label>
                        <input
                            type="number"
                            value={discount}
                            onChange={e => setDiscount(e.target.value)}
                            onWheel={(e) => e.target.blur()}
                            placeholder="e.g. 10"
                            min="0"
                            max="90"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity (Stock)</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                            onWheel={(e) => e.target.blur()}
                            placeholder="e.g. 50"
                            min="0"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Featured Toggle */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="featured"
                            checked={featured}
                            onChange={e => setFeatured(e.target.checked)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                            Mark as Featured Product
                        </label>
                    </div>
                </div>

                {/* Special Price Preview */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
                    <p className="text-sm text-gray-700">
                        Special Price after discount:
                    </p>
                    <p className="text-lg font-bold text-blue-700">
                        ₹ {specialPrice > 0 ? specialPrice.toFixed(2) : price}
                    </p>
                </div>

                {/* Description */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={6}
                        placeholder="Detailed product specifications, features, and benefits..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-y"
                    />
                </div>
            </section>

            {/* 3. Product Media - NEW Cloudinary Integration */}
            <section className="mb-10">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full ${isEditMode ? "bg-blue-600" : "bg-blue-600"} text-white flex items-center justify-center text-sm font-bold`}>
                        {isEditMode ? "2" : "3"}
                    </span>
                    Product Media
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                        <strong>Cloudinary Integration Active:</strong> Images are uploaded directly to Cloudinary CDN for fast delivery and automatic optimization (WebP format, responsive sizes).
                    </p>
                </div>

                <ImageUploader 
                    onImagesUploaded={handleImagesUploaded}
                    maxImages={5}
                    folder={isEditMode ? `products/${product.productId}` : 'products/new'}
                    existingImages={productImages}
                />

                <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc list-inside space-y-1.5">
                        <li>Images are automatically optimized and converted to WebP format</li>
                        <li>Maximum 5 images per product</li>
                        <li>First image is automatically set as primary</li>
                        <li>Supported formats: JPG, PNG, WEBP</li>
                        <li>Maximum file size: 5MB per image</li>
                    </ul>
                </div>
            </section>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
                <div className="text-sm text-gray-500">
                    <span className="font-medium">{productImages.length}</span> images uploaded •{' '}
                    <span className="font-medium">₹ {price || 0}</span>
                </div>

                <div className="flex gap-4">
                    <button
                        className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Saving...
                            </span>
                        ) : (
                            isEditMode ? "Update Product" : "Publish Product"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
