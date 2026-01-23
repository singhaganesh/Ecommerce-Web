import { Container } from "@mui/material";
import { useEffect, useRef } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, fetchFilteredProducts, fetchProducts } from "../../store/actions";
import ProductCart from "../../components/ProductCard";
import CategoryCard from "../../components/CategoryCard";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { Link } from "react-router-dom";


export default function Home() {
    const { featuredProduct, bestSellerProduct } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.category);

    const sliderRef = useRef(null);



    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFilteredProducts("featured=true", "featuredProduct"));
        dispatch(fetchFilteredProducts("bestSeller=true", "bestSellerProduct"));
        dispatch(fetchCategories());
    }, [dispatch]);
    return (
        <div className="bg-gray-50 min-h-screen">

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
                <Container>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-4">
                                Best Deals on Your Favorite Products
                            </h1>
                            <p className="text-lg mb-6">
                                Shop electronics, fashion, home essentials and more.
                            </p>
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
            <div className="min-h-40 mt-10">
                <div className="flex justify-center items-center mb-2 px-12">
                    <h2 className="text-3xl font-bold">Shop by Category</h2>
                    See
                </div>
                <p className="text-gray-500 text-center">
                    Explore our curated collections
                </p>
                <div className="justify-end flex mb-4 mr-12">
                    <Link to="/categories" className="text-indigo-600 hover:text-indigo-800 font-semibold">
                        See All
                    </Link>
                </div>

                {/* Slider Container */}
                

                    {/* Slider */}
                    <div
                        ref={sliderRef}
                        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-12"
                    >
                        {categories &&
                            categories.map((item, i) => (
                                <div key={i} className="min-w-55">
                                    <CategoryCard {...item} />
                                </div>
                            ))}
                    </div>

               
            </div>

            {/* Featured Products */}

            <div className="min-h-175 mx-10">
                <h2 className="text-3xl font-bold text-center mb-2">Featured Products</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

                    {featuredProduct &&
                        featuredProduct
                            .filter((item) => Number(item.quantity) > 0)
                            .map((item, i) => <ProductCart key={i} {...item} pageFrom="HOME" />

                            )}
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white py-12 border-t">
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
