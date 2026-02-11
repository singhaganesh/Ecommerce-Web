import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

const CategoryCard = ({ category = "Electronics", tag = "NEW ARRIVAL", imageUrl }) => {
  return (
    <div className="relative w-full max-w-2xl aspect-[16/9] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl">
      
      {/* Background Image */}
      <img 
        src={imageUrl || "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1200"} 
        alt={category}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Dark Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

      {/* Content Container */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex justify-between items-end">
        
        <div className="space-y-1">
          <p className="text-blue-500 font-bold text-xs md:text-sm tracking-[0.2em] uppercase">
            {tag}
          </p>
          <h2 className="text-white text-3xl md:text-5xl font-bold tracking-tight">
            {category}
          </h2>
        </div>

        {/* Action Button */}
        <button className="bg-blue-600 hover:bg-blue-500 text-white p-4 md:p-5 rounded-full transition-all duration-300 transform group-hover:translate-x-2 shadow-lg shadow-blue-600/40">
          <FiArrowRight className="w-6 h-6 md:w-8 md:h-8 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
};

export default CategoryCard;