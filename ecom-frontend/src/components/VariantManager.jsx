import { useState, useEffect } from 'react';
import api from '../api/api';

/**
 * VariantManager — Allows seller to create product variants.
 * Auto-detects variant attributes from the spec template (isVariant=true).
 * Each variant row has its own price, stock, SKU, and attribute values.
 *
 * Props:
 * - categoryId: The selected micro category ID
 * - basePrice: The base product price (used as default for new variants)
 * - baseDiscount: The base product discount
 * - onVariantsChange: Callback receiving the variants array
 * - initialVariants: Pre-filled variants for edit mode
 */
export default function VariantManager({ categoryId, basePrice, baseDiscount, onVariantsChange, initialVariants = [] }) {
    const [variantFields, setVariantFields] = useState([]); // { specKey, specLabel, specType, options }
    const [variants, setVariants] = useState(initialVariants);
    const [loading, setLoading] = useState(false);

    // Fetch variant fields from spec template
    useEffect(() => {
        if (!categoryId) {
            setVariantFields([]);
            return;
        }

        const fetchVariantFields = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/public/categories/${categoryId}/spec-template`);
                const fields = response.data.filter(f => f.isVariant === true);
                setVariantFields(fields);
            } catch (err) {
                console.error("Failed to fetch variant fields:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVariantFields();
    }, [categoryId]);

    // Sync variants up to parent
    useEffect(() => {
        onVariantsChange(variants);
    }, [variants]);

    const addVariant = () => {
        const attrs = {};
        variantFields.forEach(f => { attrs[f.specKey] = ""; });
        setVariants(prev => [...prev, {
            attributes: attrs,
            price: basePrice || 0,
            quantity: 1,
            primaryImage: ""
        }]);
    };

    const removeVariant = (index) => {
        setVariants(prev => prev.filter((_, i) => i !== index));
    };

    const updateVariantAttr = (index, key, value) => {
        setVariants(prev => prev.map((v, i) =>
            i === index ? { ...v, attributes: { ...v.attributes, [key]: value } } : v
        ));
    };

    const updateVariantField = (index, field, value) => {
        setVariants(prev => prev.map((v, i) =>
            i === index ? { ...v, [field]: value } : v
        ));
    };

    if (loading) {
        return <p className="text-sm text-gray-400">Loading variant options...</p>;
    }

    if (variantFields.length === 0) {
        return (
            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                <p>No variant attributes defined for this category. The product price and stock will be managed at the product level.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm text-gray-600">
                        Variant attributes: <strong>{variantFields.map(f => f.specLabel).join(", ")}</strong>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Each variant can have its own price, stock, and SKU</p>
                </div>
                <button
                    type="button"
                    onClick={addVariant}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    + Add Variant
                </button>
            </div>

            {variants.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">No variants added yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Click "Add Variant" to create product variants with different attributes and pricing.</p>
                </div>
            )}

            {variants.map((variant, idx) => (
                <div key={idx} className="mb-4 bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative">
                    {/* Remove button */}
                    <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove variant"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Variant {idx + 1}</div>

                    {/* Variant Attributes */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        {variantFields.map(field => (
                            <div key={field.specKey}>
                                <label className="block text-xs font-medium text-gray-600 mb-1">{field.specLabel}</label>
                                {field.options && field.options.length > 0 ? (
                                    <select
                                        value={variant.attributes[field.specKey] || ""}
                                        onChange={e => updateVariantAttr(idx, field.specKey, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Select {field.specLabel}</option>
                                        {field.options.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={variant.attributes[field.specKey] || ""}
                                        onChange={e => updateVariantAttr(idx, field.specKey, e.target.value)}
                                        placeholder={`Enter ${field.specLabel}`}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Price / Quantity */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Price (₹)</label>
                            <input
                                type="number"
                                value={variant.price}
                                onChange={e => updateVariantField(idx, 'price', Number(e.target.value))}
                                onWheel={e => e.target.blur()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Stock Qty</label>
                            <input
                                type="number"
                                value={variant.quantity}
                                onChange={e => updateVariantField(idx, 'quantity', Number(e.target.value))}
                                onWheel={e => e.target.blur()}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Special price preview using baseDiscount */}
                    {variant.price > 0 && baseDiscount > 0 && (
                        <div className="mt-2 text-xs text-indigo-600 font-medium">
                            Special Price: ₹{(variant.price - (variant.price * baseDiscount / 100)).toFixed(2)}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
