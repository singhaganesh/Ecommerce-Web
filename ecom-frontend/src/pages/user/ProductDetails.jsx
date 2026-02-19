import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { useCart } from "../../context/CartContext";
import RelatedProducts from "../../components/RelatedProducts";

// Templates
import FashionView from "../../components/product-templates/FashionView";
import ElectronicsView from "../../components/product-templates/ElectronicsView";
import HomeLivingView from "../../components/product-templates/HomeLivingView";
import SportsFitnessView from "../../components/product-templates/SportsFitnessView";

export default function ProductDetails() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0); // Reset scroll on change
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/public/products/id/${productId}`);
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
      toast.success("Added to cart!");
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

  // 🔹 Deduplicate Images
  const rawImages = product.primaryImage
    ? [product.primaryImage, ...(product.images || [])]
    : (product.images || []);

  const allImages = [...new Set(rawImages)];

  // 🔹 Select Template based on key words in Category Name
  const renderTemplate = () => {
    const category = (product.categoryName || "").toLowerCase();

    // Flexible matching for Fashion
    if (["fashion", "clothing", "shirt", "pant", "dress", "shoe", "wear", "jean"].some(k => category.includes(k))) {
      return <FashionView {...{ product, allImages, selectedImage, setSelectedImage, handleQuantityChange, quantity, handleAddToCart, isAvailable }} />;
    }

    // Flexible matching for Home & Living
    else if (["home", "living", "furniture", "decor", "kitchen", "bed", "chair", "table"].some(k => category.includes(k))) {
      return <HomeLivingView {...{ product, allImages, selectedImage, setSelectedImage, handleQuantityChange, quantity, handleAddToCart, isAvailable }} />;
    }

    // Flexible matching for Sports
    else if (["sport", "fitness", "gym", "yoga", "bike", "cycle", "run"].some(k => category.includes(k))) {
      return <SportsFitnessView {...{ product, allImages, selectedImage, setSelectedImage, handleQuantityChange, quantity, handleAddToCart, isAvailable }} />;
    }

    // Default to Electronics (or specific check)
    else {
      return <ElectronicsView {...{ product, allImages, selectedImage, setSelectedImage, handleQuantityChange, quantity, handleAddToCart, isAvailable }} />;
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Breadcrumb - Enhanced */}
        <nav className="mb-8 text-sm flex items-center gap-2 text-gray-500 overflow-x-auto whitespace-nowrap">
          <span>Home</span> <span>/</span>
          <span className="font-medium text-gray-900">{product.categoryName}</span> <span>/</span>
          {/* We could add Sub/Micro here if available in product object */}
          <span className="text-indigo-600 truncate">{product.productName}</span>
        </nav>

        {/* Dynamic Category View */}
        {renderTemplate()}

        {/* Related Products Section */}
        <RelatedProducts
          categoryId={product.categoryId}
          currentProductId={product.productId}
        />
      </div>
    </div>
  );
}
