import { useState, useEffect, useMemo } from "react";

/**
 * VariantSelector — PDP component that renders variant attribute selectors
 * and calls back when a variant is selected.
 *
 * Reads from `product.variants[]` (the new variant system).
 * Falls back to the old specs-based display if no variants exist.
 *
 * Props:
 * - variants: Array of { variantId, attributes: {key: value}, price, discount, specialPrice, quantity, sku, primaryImage }
 * - specifications: The product.specifications (fallback for non-variant specs)
 * - categoryName: Category name for context-aware labels
 * - onVariantChange: Callback(variant) when user selects a variant
 */
export default function VariantSelector({ variants, specifications, categoryName, onVariantChange }) {
    const [selectedValues, setSelectedValues] = useState({}); // { "size": "M", "color": "Black" }

    // Derive variant attribute keys and their unique values
    const { attrKeys, attrOptions } = useMemo(() => {
        if (!variants || variants.length === 0) return { attrKeys: [], attrOptions: {} };

        const keys = new Set();
        variants.forEach(v => {
            if (v.attributes) Object.keys(v.attributes).forEach(k => keys.add(k));
        });

        const keyArr = [...keys];
        const opts = {};
        keyArr.forEach(key => {
            opts[key] = [...new Set(variants.map(v => v.attributes?.[key]).filter(Boolean))];
        });

        return { attrKeys: keyArr, attrOptions: opts };
    }, [variants]);

    // Auto-select first variant on mount
    useEffect(() => {
        if (variants && variants.length > 0) {
            const firstVariant = variants[0];
            const initial = {};
            attrKeys.forEach(key => {
                initial[key] = firstVariant.attributes?.[key] || "";
            });
            setSelectedValues(initial);
        }
    }, [variants, attrKeys]);

    // Find matching variant whenever selection changes
    useEffect(() => {
        if (!variants || variants.length === 0) return;
        const keys = Object.keys(selectedValues);
        if (keys.length === 0) return;

        const match = variants.find(v =>
            keys.every(k => v.attributes?.[k] === selectedValues[k])
        );

        if (match && onVariantChange) {
            onVariantChange(match);
        }
    }, [selectedValues, variants]);

    // Fall back to specs-based display if no variants
    if (!variants || variants.length === 0) {
        return <SpecsFallback specifications={specifications} categoryName={categoryName} />;
    }

    // Determine label for an attribute key
    const getLabel = (key) => {
        const catLower = (categoryName || "").toLowerCase();
        if (key === "size") {
            if (catLower.includes("shoe") || catLower.includes("sneaker") || catLower.includes("footwear") ||
                catLower.includes("sandal") || catLower.includes("slipper")) return "Size (UK)";
            if (catLower.includes("jeans") || catLower.includes("pant") || catLower.includes("trouser")) return "Waist Size";
            return "Size";
        }
        if (key === "color") return "Color";
        if (key === "ram") return "RAM";
        if (key === "storage") return "Storage";
        if (key === "finish") return "Finish";
        // Default: capitalize
        return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
    };

    const handleSelect = (key, value) => {
        setSelectedValues(prev => ({ ...prev, [key]: value }));
    };

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
            {attrKeys.map(key => {
                const options = attrOptions[key];
                const isColor = key === "color";

                return (
                    <div key={key}>
                        <div className="flex justify-between mb-3">
                            <span className="font-medium text-gray-900">
                                {getLabel(key)}
                                {selectedValues[key] && (
                                    <span className="text-gray-500 font-normal ml-2">— {selectedValues[key]}</span>
                                )}
                            </span>
                            {key === "size" && (
                                <button className="text-indigo-600 text-sm font-medium hover:underline">Size Guide</button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {options.map(opt => {
                                const isSelected = selectedValues[key] === opt;

                                // Check if this option leads to an available variant
                                const wouldMatch = variants.some(v => {
                                    const testValues = { ...selectedValues, [key]: opt };
                                    return Object.keys(testValues).every(k => v.attributes?.[k] === testValues[k]);
                                });

                                if (isColor) {
                                    const hex = colorMap[opt.toLowerCase()] || "#888";
                                    const isGradient = hex.startsWith("linear");
                                    const isWhite = opt.toLowerCase() === "white";
                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => handleSelect(key, opt)}
                                            title={opt}
                                            className={`relative w-10 h-10 rounded-full transition-all
                                                ${isSelected ? "ring-2 ring-offset-2 ring-gray-900 scale-110" : "hover:scale-110"}
                                                ${isWhite ? "border border-gray-300" : ""}
                                                ${!wouldMatch ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                                            style={{
                                                background: isGradient ? hex : undefined,
                                                backgroundColor: isGradient ? undefined : hex,
                                            }}
                                            disabled={!wouldMatch}
                                        />
                                    );
                                }

                                return (
                                    <button
                                        key={opt}
                                        onClick={() => handleSelect(key, opt)}
                                        disabled={!wouldMatch}
                                        className={`min-w-[48px] h-12 px-3 rounded-lg flex items-center justify-center font-medium text-sm transition-all border-2
                                            ${isSelected
                                                ? "bg-gray-900 text-white border-gray-900 shadow-lg"
                                                : wouldMatch
                                                    ? "bg-white text-gray-700 border-gray-300 hover:border-gray-900 cursor-pointer"
                                                    : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


/**
 * Fallback: Display specs-based size/color like the old behavior.
 * Used for products without actual variants.
 */
function SpecsFallback({ specifications, categoryName }) {
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    if (!specifications) return null;

    const sizes = specifications.size || specifications.waist_size || [];
    const colors = specifications.color || [];

    const hasSizes = Array.isArray(sizes) && sizes.length > 0;
    const hasColors = Array.isArray(colors) && colors.length > 0;

    if (!hasSizes && !hasColors) return null;

    const catLower = (categoryName || "").toLowerCase();
    let sizeLabel = "Select Size";
    if (catLower.includes("shoe") || catLower.includes("sneaker") || catLower.includes("footwear") ||
        catLower.includes("sandal") || catLower.includes("slipper")) {
        sizeLabel = "Select Size (UK)";
    } else if (catLower.includes("jeans") || catLower.includes("pant") || catLower.includes("trouser")) {
        sizeLabel = "Select Waist Size";
    }

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
