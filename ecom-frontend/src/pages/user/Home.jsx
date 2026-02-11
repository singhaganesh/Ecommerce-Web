import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, fetchFilteredProducts } from "../../store/actions";
import ProductCard from "../../components/ProductCard";
import CategoryCard from "../../components/CategoryCard";
import { useAuth } from "../../context/AuthContext";

const defaultCategories = [
  { categoryId: 1, categoryName: "Electronics", productCount: 15 },
  { categoryId: 2, categoryName: "Fashion", productCount: 25 },
  { categoryId: 3, categoryName: "Home & Living", productCount: 20 },
  { categoryId: 4, categoryName: "Sports & Fitness", productCount: 12 }
];

export default function Home() {
  const { featuredProduct } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.category);
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchCategories());
        await dispatch(fetchFilteredProducts("featured=true&pageSize=10", "featuredProduct"));
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
        setDataLoaded(true);
      }
    };
    loadData();
  }, [dispatch]);

  const displayCategories = dataLoaded && categories && categories.length > 0 ? categories.slice(0, 4) : defaultCategories;
  const displayProducts = featuredProduct && featuredProduct.length > 0 ? featuredProduct.filter(item => item.featured === true).slice(0, 10) : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              {isAuthenticated() ? (
                <>
                  <h1 className="text-5xl font-bold mb-4">
                    Welcome back, {user?.userName || 'User'}!
                  </h1>
                  <p className="text-xl mb-6">
                    Continue shopping and explore our latest deals.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-5xl font-bold mb-4">
                    Best Deals on Your Favorite Products
                  </h1>
                  <p className="text-xl mb-6">
                    Shop electronics, fashion, home essentials and more.
                  </p>
                </>
              )}
              <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-gray-100 transition">
                Shop Now
              </button>
            </div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
              alt="shopping"
              className="w-80 mt-8 md:mt-0"
            />
          </div>
        </Container>
      </div>

      {/* Categories Section */}
      <section className="py-12 px-4 md:px-8 lg:px-12 bg-white">
        <div className="max-w-full">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Shop by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {displayCategories.map((item) => (
              <CategoryCard 
                key={item.categoryId} 
                categoryId={item.categoryId}
                categoryName={item.categoryName}
                productCount={item.productCount}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 px-4 md:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Featured Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked selection of our best products just for you
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600"></div>
            </div>
          ) : displayProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {displayProducts.map((item) => (
                <ProductCard 
                  key={item.productId} 
                  {...item} 
                  pageFrom="HOME"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No featured products available</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <div className="bg-white py-10 border-t">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="font-bold text-xl text-gray-900">Secure Payments</h3>
              <p className="text-gray-600 mt-2">100% protected transactions</p>
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">Fast Delivery</h3>
              <p className="text-gray-600 mt-2">Quick doorstep delivery</p>
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">Easy Returns</h3>
              <p className="text-gray-600 mt-2">Hassle-free returns</p>
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">24/7 Support</h3>
              <p className="text-gray-600 mt-2">Always here to help</p>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
