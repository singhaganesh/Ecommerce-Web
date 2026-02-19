import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilteredProducts } from "../store/actions/productActions";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ categoryId, currentProductId }) {
    const dispatch = useDispatch();
    const { filteredProducts, loading } = useSelector((state) => state.products);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (categoryId) {
            // Fetch products from same category
            dispatch(fetchFilteredProducts(`category=${categoryId}`, "filteredProducts"));
        }
    }, [categoryId, dispatch]);

    useEffect(() => {
        if (filteredProducts) {
            // Filter out current product
            const related = filteredProducts.filter(p => p.productId !== Number(currentProductId));
            setProducts(related);
        }
    }, [filteredProducts, currentProductId]);

    if (!products || products.length === 0) return null;

    return (
        <div className="py-12 border-t mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>

            <div className="relative">
                {/* Scrollable Container */}
                <div className="flex overflow-x-auto gap-6 pb-6 pt-2 scrollbar-hide snap-x">
                    {products.slice(0, 8).map((product) => (
                        <div key={product.productId} className="min-w-[280px] snap-start">
                            <ProductCard {...product} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
