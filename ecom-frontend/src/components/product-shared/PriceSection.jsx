export default function PriceSection({ price, specialPrice }) {
    const numPrice = Number(price);
    const numSpecial = specialPrice ? Number(specialPrice) : null;
    const isDiscounted = numSpecial && numSpecial < numPrice;

    return (
        <div className="space-y-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                    ₹{isDiscounted ? numSpecial.toFixed(0) : numPrice.toFixed(0)}
                </span>
                {isDiscounted && (
                    <span className="text-lg text-gray-400 line-through">
                        ₹{numPrice.toFixed(0)}
                    </span>
                )}
            </div>
            <p className="text-green-600 text-sm font-medium">Inclusive of all taxes</p>
        </div>
    );
}
