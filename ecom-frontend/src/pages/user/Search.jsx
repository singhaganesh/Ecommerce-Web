import React from 'react';

const Search = () => {
  const products = [
    {
      id: 1,
      name: "AeroGlide Elite Run X2",
      subtitle: "Professional Road Running",
      price: 145.00,
      originalPrice: 199.99,
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop&q=80",
      badges: ["BEST SELLER"],
      isFavorite: false,
    },
    {
      id: 2,
      name: "CloudRunner Neo Mesh",
      subtitle: "Ultra-Breathable Cushioning",
      price: 129.00,
      rating: 4.7,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80",
      badges: [],
      isFavorite: true,
    },
    {
      id: 3,
      name: "Apex Trail Blazer 4.0",
      subtitle: "Rugged All-Terrain Grip",
      price: 159.00,
      rating: 4.6,
      reviews: 52,
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop&q=80",
      badges: ["NEW ARRIVAL"],
      isFavorite: false,
    },
    {
      id: 4,
      name: "SwiftLift Marathon Pro",
      subtitle: "Lightweight Racing Flat",
      price: 199.00,
      rating: 4.9,
      reviews: 210,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
      badges: [],
      isFavorite: false,
    },
    {
      id: 5,
      name: "Zenith Cross-Trainer",
      subtitle: "Versatile Gym & Road",
      price: 115.00,
      rating: 4.7,
      reviews: 75,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80",
      badges: [],
      isFavorite: true,
    },
    {
      id: 6,
      name: "Vortex Max Velocity",
      subtitle: "High-Energy Return Foam",
      price: 175.00,
      rating: 4.8,
      reviews: 342,
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop&q=80",
      badges: [],
      isFavorite: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Header with title and sort aligned on the same line */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            1,240 results for "running shoes"
          </h1>
          <p className="mt-1 text-gray-600">
            High-performance gear for every athlete's journey.
          </p>
        </div>

        {/* Sort section moved to top-right */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</span>
          <select className="block rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-sm focus:border-blue-500 focus:ring-blue-500 min-w-[180px]">
            <option>Most Relevant</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Customer Rating</option>
            <option>Newest Arrivals</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Clear All
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">CATEGORIES</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Road Running</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Trail Running</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Track & Field</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">POPULAR BRANDS</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Nike (421)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Adidas (312)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">New Balance (185)</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">PRICE RANGE</h4>
              <input
                type="range"
                min="40"
                max="250"
                defaultValue="145"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>$40</span>
                <span>$250</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">RATING</h4>
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">★★★★☆ & Up</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="relative pt-[100%] bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain p-6"
                  />
                  <button
                    className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors ${
                      product.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    ♥
                  </button>
                  {product.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-white rounded ${
                        badge === 'BEST SELLER' ? 'bg-orange-500' : 'bg-emerald-500'
                      }`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="p-5">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">{product.subtitle}</p>

                  <div className="mt-3 flex items-center">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">({product.reviews})</span>
                  </div>

                  <div className="mt-4 flex items-baseline">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-3 text-sm text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center items-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">&lt;</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">3</button>
            <span className="px-2 text-gray-500">...</span>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">12</button>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">&gt;</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Search;