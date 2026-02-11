import { Container } from "@mui/material";
import { useEffect, useRef } from "react";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, fetchFilteredProducts, fetchProducts } from "../../store/actions";
import ProductCard from "../../components/ProductCard";
import CategoryCard from "../../components/CategoryCard";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


export default function Home() {
    const { featuredProduct, bestSellerProduct } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.category);
    const { user, isAuthenticated } = useAuth();

    const sliderRef = useRef(null);



    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFilteredProducts("featured=true&pageSize=10", "featuredProduct"));
        dispatch(fetchFilteredProducts("bestSeller=true", "bestSellerProduct"));
        dispatch(fetchCategories());
    }, [dispatch]);
    return (
        <div className="bg-gray-50 min-h-screen">

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
                <Container>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div>
                            {isAuthenticated() ? (
                                <>
                                    <h1 className="text-4xl font-bold mb-4">
                                        Welcome back, {user?.userName || 'User'}!
                                    </h1>
                                    <p className="text-lg mb-6">
                                        Continue shopping and explore our latest deals.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h1 className="text-4xl font-bold mb-4">
                                        Best Deals on Your Favorite Products
                                    </h1>
                                    <p className="text-lg mb-6">
                                        Shop electronics, fashion, home essentials and more.
                                    </p>
                                </>
                            )}
                            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold shadow">
                                Shop Now
                            </button>
                        </div>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
                            alt="shopping"
                            className="w-64 mt-8 md:mt-0"
                        />
                    </div>
                </Container>
            </div>


            


            {/* Categories Section */}
            <section className="py-8 px-4 md:px-8 lg:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">Shop by Category</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Explore our wide range of categories and find exactly what you're looking for
                        </p>
                    </div>

                    {/* Categories Grid */}
                    {categories && categories.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {categories.slice(0, 10).map((item) => (
                                <CategoryCard 
                                    key={item.categoryId} 
                                    categoryId={item.categoryId}
                                    categoryName={item.categoryName}
                                    image={item.image}
                                    productCount={item.productCount}
                                />
                            ))}
                        </div>
                    ) : (
                        /* Loading State */
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-8 px-4 md:px-8 lg:px-12 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">Featured Products</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Handpicked selection of our best products just for you
                        </p>
                    </div>

                    {/* Products Grid - 5 columns = 2 rows for 10 products */}
                    {featuredProduct && featuredProduct.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                            {featuredProduct
                                .filter((item) => item.featured === true)
                                .slice(0, 10)
                                .map((item) => (
                                    <ProductCard 
                                        key={item.productId} 
                                        {...item} 
                                        pageFrom="HOME"
                                    />
                                ))}
                        </div>
                    ) : (
                        /* Loading State */
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us */}
            <div className="bg-white py-8 border-t">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <h3 className="font-bold text-lg">Secure Payments</h3>
                            <p className="text-gray-600">100% protected transactions</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Fast Delivery</h3>
                            <p className="text-gray-600">Quick doorstep delivery</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Easy Returns</h3>
                            <p className="text-gray-600">Hassle-free returns</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">24/7 Support</h3>
                            <p className="text-gray-600">Always here to help</p>
                        </div>
                    </div>
                </Container>
            </div>

        </div>
    );
}
