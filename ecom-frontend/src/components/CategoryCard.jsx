import { Link } from "react-router-dom";

const CategoryCard = ({ categoryId, categoryName, image, productCount }) => {
  return (
    <Link 
      to={`/categories/${categoryId}`}
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="aspect-square overflow-hidden">
        <img
          src={image || "https://via.placeholder.com/300x300?text=Category"}
          alt={categoryName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3
          className="text-white font-bold text-lg mb-1 drop-shadow-lg"
          title={categoryName}
        >
          {categoryName}
        </h3>
        
        {/* Product Count */}
        {productCount !== undefined && (
          <p className="text-white/90 text-sm drop-shadow">
            {productCount} {productCount === 1 ? 'Item' : 'Items'}
          </p>
        )}
      </div>

      {/* Hover Shop Button */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
          Shop →
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
