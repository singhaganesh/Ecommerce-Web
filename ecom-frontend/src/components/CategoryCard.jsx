import { Link } from "react-router-dom";
import electronicsImg from "../assets/CategoryImages/Electronics.jpg";
import fashionImg from "../assets/CategoryImages/Fashion.jpg";
import homeImg from "../assets/CategoryImages/Home & Living.jpg";
import sportsImg from "../assets/CategoryImages/Sports & Fitness.jpg";

const categoryImages = {
  1: electronicsImg,
  2: fashionImg,
  3: homeImg,
  4: sportsImg
};

const categoryNames = {
  1: "Electronics",
  2: "Fashion", 
  3: "Home & Living",
  4: "Sports & Fitness"
};

const CategoryCard = ({ categoryId, categoryName, productCount }) => {
  const id = parseInt(categoryId) || 1;
  const bgImage = categoryImages[id] || categoryImages[1];
  const displayName = categoryName || categoryNames[id] || "Category";

  return (
    <Link 
      to={`/search?category=${id}`}
      className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      <img 
        src={bgImage} 
        alt={displayName}
        className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end h-full">
        <h3 className="text-white text-4xl font-bold mb-2">
          {displayName}
        </h3>
        <p className="text-gray-300 text-lg">
          {productCount || 0} products
        </p>
      </div>

      <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </Link>
  );
};

export default CategoryCard;
