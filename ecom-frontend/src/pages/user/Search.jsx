import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaFilter, FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/actions/categoryActions";
import api from "../../api/api";
import ProductCard from "../../components/ProductCard";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(true);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    fetchProducts();
  }, [searchParams, selectedCategories, priceRange, minRating, sortBy, currentPage, inStockOnly]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let queryParams = new URLSearchParams();

      if (searchParams.get("q")) {
        queryParams.append("keyword", searchParams.get("q"));
      }

      if (selectedCategories.length > 0) {
        queryParams.append("categoryId", selectedCategories.join(","));
      }

      if (priceRange.min > 0) queryParams.append("minPrice", priceRange.min);
      if (priceRange.max < 10000) queryParams.append("maxPrice", priceRange.max);
      if (minRating > 0) queryParams.append("rating", minRating);
      if (inStockOnly) queryParams.append("stock", "true");

      queryParams.append("page", currentPage);
      queryParams.append("pageSize", pageSize);

      switch (sortBy) {
        case "price-low":
          queryParams.append("sortBy", "price");
          queryParams.append("direction", "asc");
          break;
        case "price-high":
          queryParams.append("sortBy", "price");
          queryParams.append("direction", "desc");
          break;
        case "rating":
          queryParams.append("sortBy", "rating");
          break;
        case "newest":
          queryParams.append("sortBy", "createdAt");
          queryParams.append("direction", "desc");
          break;
        default:
          break;
      }

      const response = await api.get(`/products?${queryParams.toString()}`);
      setProducts(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm });
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 10000 });
    setMinRating(0);
    setSortBy("relevance");
    setInStockOnly(false);
    setCurrentPage(0);
  };

  const totalResults = products.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Search
              </button>
            </div>
          </form>

          {initialQuery && (
            <p className="mt-4 text-gray-600">
              {totalResults} results for "<span className="font-semibold">{initialQuery}</span>"
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FaFilter /> Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <label key={cat.categoryId} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.categoryId)}
                        onChange={() => handleCategoryChange(cat.categoryId)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {cat.categoryName}
                        <span className="text-gray-400 ml-1">({cat.productCount || 0})</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Min"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Max"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-3 accent-indigo-600"
                />
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Customer Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="ml-2 flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-600">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(!inStockOnly)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort & View Options */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
              >
                <FaFilter /> Filters
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(0);
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.productId} {...product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i;
                      } else if (currentPage < 2) {
                        pageNum = i;
                      } else if (currentPage > totalPages - 3) {
                        pageNum = totalPages - 5 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg text-sm ${
                            currentPage === pageNum
                              ? "bg-indigo-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={currentPage === totalPages - 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaSearch className="text-4xl text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h2>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
