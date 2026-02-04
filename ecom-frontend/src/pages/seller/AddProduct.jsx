// CreateProductForm.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMainCategories, fetchChildrenCategories } from "../../store/actions/categoryActions";
import { createProduct } from "../../store/actions/productActions";

export default function AddProduct({ onClose }) {

    const dispatch = useDispatch();
    const { mainCategories, subCategories, microCategories } = useSelector(state => state.category);

    const [mainCategory, setMainCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [microCategory, setMicroCategory] = useState("");

    const [productName, setProductName] = useState("");
    const [brand, setBrand] = useState("");
    const [description, setDescription] = useState("");

    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState(0);
    const [quantity, setQuantity] = useState("");

    const [images, setImages] = useState([]);

    const specialPrice = price - (price * discount) / 100;


    /* Load main categories */
    useEffect(() => {
        dispatch(fetchMainCategories());
    }, [dispatch]);

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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
    };


    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handlePublish = () => {
        // Basic client-side validation to prevent 400 errors
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

        const productData = {
            productName,
            brand,
            description,
            price: Number(price),
            discount: Number(discount),
            quantity: Number(quantity),  // Add quantity to match ProductDTO/Product model
            specialPrice: Number(specialPrice.toFixed(2)),
        };

        dispatch(
            createProduct(
                productData,
                images,
                microCategory, // 🔥 MICRO category ID
                2              // 🔥 sellerId (replace with logged-in seller id)
            )
        );

        onClose();
    };


    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-sm border">
            <h1 className="text-2xl font-bold mb-8 text-gray-800">Create New Product</h1>

            {/* 1. Category Selection */}
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

            {/* 2. Product Information */}
            <section className="mb-10">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</span>
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
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Brand */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand</label>
                        <input
                            type="text"
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                            placeholder="e.g. Noise, boAt, Fire-Boltt"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
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
                            placeholder="e.g. 50"
                            min="0"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
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


            {/* 3. Product Media */}
            <section className="mb-10">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</span>
                    Product Media
                </h2>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                    {images.length === 0 ? (
                        <>
                            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-700 font-medium mb-1">Drag & drop product images here</p>
                            <p className="text-sm text-gray-500 mb-4">or</p>
                            <label className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                                Browse Files
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {images.map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}   // ✅ correct
                                        alt={`preview-${index}`}
                                        className="w-full h-40 object-cover rounded-lg border"
                                    />

                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            <label className="h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400">
                                <span className="text-gray-500">+ Add more</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}

                    <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                        <ul className="list-disc list-inside space-y-1.5 text-left max-w-xl mx-auto">
                            <li>Images must be clear, well-lit</li>
                            <li>Images should not contain any text, watermark, or logo</li>
                            <li>Maximum 9 images (recommended 5–8)</li>
                            <li>Show product from different angles</li>
                            <li>Minimum resolution: 1000×1000 pixels</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
                <div className="text-sm text-gray-500">
                    <span className="font-medium">0</span> / 5000 characters •{' '}
                    <span className="font-medium">₹ {price}</span>
                </div>

                <div className="flex gap-4">
                    <button
                        className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button onClick={handlePublish}
                        className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer">
                        Publish Product
                    </button>
                </div>
            </div>
        </div>
    );
}