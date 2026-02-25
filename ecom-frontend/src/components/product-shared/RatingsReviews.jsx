import { FaStar, FaRegStar } from "react-icons/fa";

export default function RatingsReviews({ rating, reviewCount }) {
    const numRating = Number(rating) || 0;

    return (
        <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center bg-green-100 px-2 py-0.5 rounded text-green-700 font-bold text-sm gap-1">
                {numRating.toFixed(1)} <FaStar size={12} />
            </div>
            <span className="text-gray-500 text-sm hover:text-indigo-600 cursor-pointer underline decoration-dotted">
                {reviewCount || 0} Ratings & Reviews
            </span>
        </div>
    );
}
