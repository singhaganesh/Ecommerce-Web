const CategoryCard = ({ categoryId, categoryName, image }) => {
  return (
    <div className="flex flex-col items-center bg-white rounded-3xl shadow hover:shadow-lg transition p-2 cursor-pointer mb-5">

      {/* Image */}
      <div className="w-full h-40 rounded-2xl overflow-hidden mb-2">
        <img
          src={image || "https://via.placeholder.com/400x300"}
          alt={categoryName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Name (single line with ... ) */}
      <h3
        className="text-l font-semibold mb-2 truncate w-full text-center"
        title={categoryName}   // 👈 shows full name on hover
      >
        {categoryName}
      </h3>

      {/* Button */}
      <button className="text-xs border border-gray-300 rounded-full px-3 py-1 hover:bg-black hover:text-white transition">
        Shop Now
      </button>
    </div>
  );
};

export default CategoryCard;
