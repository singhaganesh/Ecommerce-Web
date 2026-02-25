import { useState } from "react";

/**
 * VariantSelector — Smart component that renders size/color selection
 * based on the product's specifications data.
 * 
 * - Detects available sizes from specs.size or specs.waist_size
 * - Detects available colors from specs.color  
 * - Renders nothing if no variants exist
 * - Determines appropriate labels (e.g., "Size (UK)" for shoes)
 */
export default function VariantSelector({ specifications, categoryName }) {
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    if (!specifications) return null;

    // Extract variant data
    const sizes = specifications.size || specifications.waist_size || [];
    const colors = specifications.color || [];

    const hasSizes = Array.isArray(sizes) && sizes.length > 0;
    const hasColors = Array.isArray(colors) && colors.length > 0;

    if (!hasSizes && !hasColors) return null;

    // Determine size label based on category
    const catLower = (categoryName || "").toLowerCase();
    let sizeLabel = "Select Size";
    if (catLower.includes("shoe") || catLower.includes("sneaker") || catLower.includes("footwear") ||
        catLower.includes("sandal") || catLower.includes("slipper")) {
        sizeLabel = "Select Size (UK)";
    } else if (catLower.includes("jeans") || catLower.includes("pant") || catLower.includes("trouser")) {
        sizeLabel = "Select Waist Size";
    } else if (catLower.includes("bat") || catLower.includes("cricket")) {
        sizeLabel = "Select Size";
    }

    // Color hex mapping
    const colorMap = {
        "black": "#000000", "white": "#FFFFFF", "blue": "#2563EB", "red": "#DC2626",
        "green": "#16A34A", "silver": "#C0C0C0", "gold": "#D4AF37", "grey": "#6B7280",
        "pink": "#EC4899", "purple": "#7C3AED", "navy": "#1E3A5F", "brown": "#92400E",
        "yellow": "#EAB308", "orange": "#F97316", "maroon": "#800000",
        "rose gold": "#B76E79", "multi": "linear-gradient(135deg, red, blue, green, yellow)",
        "khaki": "#C3B091", "space grey": "#717378",
    };

    return (
        <div className="space-y-6">
            {/* Size Selector */}
            {hasSizes && (
                <div>
                    <div className="flex justify-between mb-3">
                        <span className="font-medium text-gray-900">{sizeLabel}</span>
                        <button className="text-indigo-600 text-sm font-medium hover:underline">Size Guide</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`min-w-[48px] h-12 px-3 rounded-lg flex items-center justify-center font-medium text-sm transition-all border-2
                                    ${selectedSize === size
                                        ? "bg-gray-900 text-white border-gray-900 shadow-lg"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Color Selector */}
            {hasColors && (
                <div>
                    <span className="font-medium text-gray-900 block mb-3">
                        Select Color {selectedColor && <span className="text-gray-500 font-normal">— {selectedColor}</span>}
                    </span>
                    <div className="flex flex-wrap gap-3">
                        {colors.map(color => {
                            const hex = colorMap[color.toLowerCase()] || "#888";
                            const isGradient = hex.startsWith("linear");
                            const isWhite = color.toLowerCase() === "white";
                            return (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    title={color}
                                    className={`relative w-10 h-10 rounded-full transition-all
                                        ${selectedColor === color
                                            ? "ring-2 ring-offset-2 ring-gray-900 scale-110"
                                            : "hover:scale-110"
                                        } ${isWhite ? "border border-gray-300" : ""}`}
                                    style={{
                                        background: isGradient ? hex : undefined,
                                        backgroundColor: isGradient ? undefined : hex,
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
