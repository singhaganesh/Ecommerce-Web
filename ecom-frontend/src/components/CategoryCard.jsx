import { Link } from "react-router-dom";

const CategoryCard = ({ categoryId, categoryName, image, productCount }) => {
  return (
    <Link 
      to={`/categories/${categoryId}`}
      className="flex flex-col items-center bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 cursor-pointer mb-5 group"
    >
      {/* Image Container */}
      <div className="w-full h-44 rounded-xl overflow-hidden mb-3 relative">
        <img
          src={image || "https://via.placeholder.com/400x300?text=Category"}
          alt={categoryName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </div>

      {/* Category Info */}
      <div className="text-center w-full">
        <h3
          className="text-lg font-bold mb-1 text-gray-800 group-hover:text-indigo-600 transition-colors truncate w-full"
          title={categoryName}
        >
          {categoryName}
        </h3>
        
        {/* Product Count */}
        {productCount !== undefined && (
          <p className="text-sm text-gray-500 mb-2">
            {productCount} {productCount === 1 ? 'Product' : 'Products'}
          </p>
        )}

        {/* Shop Now Button */}
        <button className="text-sm bg-indigo-600 text-white rounded-full px-4 py-1.5 hover:bg-indigo-700 transition-colors duration-300 font-medium">
          Shop Now
        </button>
      </div>
    </Link>
  );
};

export default CategoryCard;
