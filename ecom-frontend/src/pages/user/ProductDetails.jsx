import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaMinus, FaPlus, FaShoppingCart, FaStar, FaRegStar, FaHeart, FaShareAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../api/api";
import { useCart } from "../../context/CartContext";

export default function ProductDetails() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${productId}`);
      setProduct(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product details");
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= (product?.quantity || 1)) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (product && product.quantity > 0) {
      const cartItem = {
        productId: product.productId,
        productName: product.productName,
        primaryImage: product.primaryImage,
        price: product.specialPrice || product.price,
        quantity: quantity,
        maxQuantity: product.quantity
      };
      addToCart(cartItem);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600">{error || "The product you're looking for doesn't exist."}</p>
        </div>
      </div>
    );
  }

  const isAvailable = product.quantity > 0;
  const discountPercent = product.discount 
    ? Math.round((product.discount / product.price) * 100) 
    : 0;

  const allImages = product.primaryImage 
    ? [product.primaryImage, ...(product.images || [])] 
    : (product.images || []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <span className="text-gray-500">Home</span>
          <span className="mx-2">/</span>
          <span className="text-gray-500">{product.categoryName || "Products"}</span>
          <span className="mx-2">/</span>
          <span className="text-indigo-600 font-medium">{product.productName}</span>
        </nav>

        {/* Main Product Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            
            {/* Left - Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                {allImages[selectedImage] ? (
                  <img
                    src={allImages[selectedImage]}
                    alt={product.productName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition
                        ${selectedImage === index ? "border-indigo-600" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <img src={img} alt={`${product.productName} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Product Info */}
            <div className="space-y-6">
              {/* Title & Rating */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {product.productName}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      i < Math.floor(product.rating || 0) ? (
                        <FaStar key={i} size={16} />
                      ) : (
                        <FaRegStar key={i} size={16} />
                      )
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1">
                {product.specialPrice ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-indigo-600">
                      ₹{Number(product.specialPrice).toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{Number(product.price).toFixed(2)}
                    </span>
                    <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                      {discountPercent}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-indigo-600">
                    ₹{Number(product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2">
                {isAvailable ? (
                  <>
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-green-600 font-medium">
                      In Stock ({product.quantity} available)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Quantity Selector */}
              {isAvailable && (
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaMinus size={14} />
                    </button>
                    <span className="px-6 py-2 text-center font-medium min-w-[60px]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.quantity}
                      className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaPlus size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className={`flex-1 flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition
                    ${isAvailable 
                      ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                >
                  <FaShoppingCart />
                  {isAvailable ? "Add to Cart" : "Out of Stock"}
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <FaHeart className="text-gray-600" />
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <FaShareAlt className="text-gray-600" />
                </button>
              </div>

              {/* Features/Specs */}
              {product.features && product.features.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t">
            <div className="flex border-b">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium capitalize transition
                    ${activeTab === tab 
                      ? "text-indigo-600 border-b-2 border-indigo-600" 
                      : "text-gray-500 hover:text-gray-700"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="p-6 md:p-8">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {product.description || "No description available."}
                  </p>
                </div>
              )}
              
              {activeTab === "specifications" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications ? (
                    Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex border-b py-3">
                        <span className="font-medium text-gray-700 w-40">{key}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No specifications available.</p>
                  )}
                </div>
              )}
              
              {activeTab === "reviews" && (
                <div>
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {product.reviews.map((review, index) => (
                        <div key={index} className="border-b pb-6">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                i < review.rating ? (
                                  <FaStar key={i} size={14} />
                                ) : (
                                  <FaRegStar key={i} size={14} />
                                )
                              ))}
                            </div>
                            <span className="font-medium">{review.userName}</span>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
