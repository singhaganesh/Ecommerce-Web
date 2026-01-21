import { Container } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../store/actions";
import CategoryCard from "../components/CategoryCard";

export default function Categories() {
    const { categories } = useSelector((state) => state.categories);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <Container>
                <h1 className="text-4xl font-bold text-center mb-8">All Categories</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {categories &&
                        categories.map((item, i) => (
                            <CategoryCard key={i} {...item} />
                        ))}
                </div>
            </Container>
        </div>
    );
}