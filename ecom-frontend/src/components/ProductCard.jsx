import { FaShoppingCart } from "react-icons/fa";

const ProductCard = ({
  productId,
  productName,
  image,
  primaryImage,
  images,
  description,
  quantity,
  price,
  discount,
  specialPrice,
  pageFrom,
}) => {
  const isAvailable = quantity && Number(quantity) > 0;

  const hideExtraUI = pageFrom === "HOME";   // 👈 condition

  // Get the correct image URL
  const productImage = primaryImage || (images && images.length > 0 ? images[0] : null);

  return (
    <div className="border rounded-md shadow hover:shadow-lg transition p-2 bg-white">

      {/* Image */}
      <div className="w-full h-36 overflow-hidden flex justify-center items-center bg-gray-50">
        {productImage ? (
          <img
            src={productImage}
            alt={productName}
            className="h-full object-contain"
          />
        ) : (
          <div className="text-gray-400 text-sm">No Image</div>
        )}
      </div>

      {/* Content */}
      <div className="mt-2 space-y-1">
        <h2 className="text-sm font-semibold truncate">
          {productName}
        </h2>

        {/* Description only if NOT from HOME */}
        {!hideExtraUI && (
          <p className="text-xs text-gray-500 line-clamp-2">
            {description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-1">
          {specialPrice ? (
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 line-through">
                ₹ {Number(price).toFixed(2)}
              </span>
              <span className="text-sm font-bold text-slate-800">
                ₹ {Number(specialPrice).toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold text-slate-800">
              ₹ {Number(price).toFixed(2)}
            </span>
          )}

          {/* Button only if NOT from HOME */}
          {!hideExtraUI && (
            <button
              disabled={!isAvailable}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-md text-white transition
                ${
                  isAvailable
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              <FaShoppingCart size={12} />
              {isAvailable ? "Add" : "Out"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
