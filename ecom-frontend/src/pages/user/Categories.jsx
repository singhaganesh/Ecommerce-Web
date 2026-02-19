import { Container } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/actions";
import { Link } from "react-router-dom";
import { CategoryCard } from "../../components/CategoryCard";

// Import local category images
import electronicsImg from "../../assets/CategoryImages/Electronics.jpg";
import fashionImg from "../../assets/CategoryImages/Fashion.jpg";
import homeImg from "../../assets/CategoryImages/Home & Living.jpg";
import sportsImg from "../../assets/CategoryImages/Sports & Fitness.jpg";

const categoryImages = {
    1: electronicsImg,
    2: fashionImg,
    3: homeImg,
    4: sportsImg
};

export default function Categories() {
    const { categories } = useSelector((state) => state.category);
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
                        categories.map((cat, i) => {
                            const hasBackendImage = cat.image && !cat.image.includes("default.png");
                            const imageSrc = categoryImages[cat.categoryId] || (hasBackendImage ? cat.image : "https://images.unsplash.com/photo-1557683316-973673baf926?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JhZGllbnR8ZW58MHx8MHx8fDA%3D");

                            return (
                                <Link to={`/search?category=${cat.categoryId}`} key={i}>
                                    <CategoryCard className="flex flex-col items-start justify-end py-8 px-6">
                                        <img
                                            className="h-full w-full absolute inset-0 object-cover opacity-80 transition-opacity group-hover:opacity-100"
                                            src={imageSrc}
                                            alt={cat.categoryName}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                        <div className="relative z-10 w-full">
                                            <p className="font-bold text-white text-xl">{cat.categoryName}</p>
                                        </div>
                                    </CategoryCard>
                                </Link>
                            );
                        })}
                </div>
            </Container>
        </div>
    );
}