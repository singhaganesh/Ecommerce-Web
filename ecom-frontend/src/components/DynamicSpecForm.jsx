import { useState, useEffect, useRef } from 'react';
import api from '../api/api';

/**
 * DynamicSpecForm - Renders specification input fields based on the category's spec template.
 * 
 * Props:
 * - categoryId: The selected micro category ID
 * - onSpecsChange: Callback receiving the specs object { key: value, ... }
 * - initialSpecs: Optional pre-filled specs (for edit mode)
 */
export default function DynamicSpecForm({ categoryId, onSpecsChange, initialSpecs = {} }) {
    const [template, setTemplate] = useState([]);
    const [specs, setSpecs] = useState(initialSpecs);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Use ref to always get latest initialSpecs inside effects
    const initialSpecsRef = useRef(initialSpecs);
    initialSpecsRef.current = initialSpecs;

    // Fetch template when category changes
    useEffect(() => {
        if (!categoryId) {
            setTemplate([]);
            setSpecs({});
            return;
        }

        const fetchTemplate = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/public/categories/${categoryId}/spec-template`);
                setTemplate(response.data);

                // Use the ref to get latest initialSpecs (avoids stale closure)
                const currentInitialSpecs = initialSpecsRef.current || {};

                // Preserve initial specs for fields that exist in the template
                // Also include any extra specs not in template (backward compat)
                const preserved = { ...currentInitialSpecs };
                setSpecs(preserved);
                onSpecsChange(preserved);
            } catch (err) {
                console.error("Failed to fetch spec template:", err);
                setError("Could not load specification fields");
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [categoryId]);

    const handleChange = (key, value) => {
        const updated = { ...specs, [key]: value };
        setSpecs(updated);
        onSpecsChange(updated);
    };

    // Handle multi-select for SIZE_SELECTOR (toggle selection)
    const handleSizeToggle = (key, size) => {
        const current = specs[key] || [];
        const arr = Array.isArray(current) ? current : [];
        const updated = arr.includes(size)
            ? arr.filter(s => s !== size)
            : [...arr, size];
        handleChange(key, updated);
    };

    // Handle multi-select for COLOR_PICKER
    const handleColorToggle = (key, color) => {
        const current = specs[key] || [];
        const arr = Array.isArray(current) ? current : [];
        const updated = arr.includes(color)
            ? arr.filter(c => c !== color)
            : [...arr, color];
        handleChange(key, updated);
    };

    if (!categoryId) return null;
    if (loading) {
        return (
            <div className="py-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading specifications...</p>
            </div>
        );
    }
    if (error) return <p className="text-red-500 text-sm py-4">{error}</p>;
    if (template.length === 0) return <p className="text-gray-400 text-sm py-4 italic">No specification fields defined for this category.</p>;

    // Group fields by specGroup
    const grouped = {};
    template.forEach(field => {
        const group = field.specGroup || "General";
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(field);
    });

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
            {Object.entries(grouped).map(([groupName, fields]) => (
                <div key={groupName}>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">
                        {groupName}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map(field => (
                            <div key={field.specKey} className={field.specType === "SIZE_SELECTOR" || field.specType === "COLOR_PICKER" ? "md:col-span-2" : ""}>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {field.specLabel}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                    {field.isVariant && <span className="text-xs text-blue-600 ml-2 bg-blue-50 px-2 py-0.5 rounded-full">Variant</span>}
                                </label>

                                {/* TEXT input */}
                                {field.specType === "TEXT" && (
                                    <input
                                        type="text"
                                        value={specs[field.specKey] || ""}
                                        onChange={e => handleChange(field.specKey, e.target.value)}
                                        placeholder={`Enter ${field.specLabel}`}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                )}

                                {/* NUMBER input */}
                                {field.specType === "NUMBER" && (
                                    <input
                                        type="number"
                                        value={specs[field.specKey] || ""}
                                        onChange={e => handleChange(field.specKey, e.target.value)}
                                        placeholder={`Enter ${field.specLabel}`}
                                        onWheel={(e) => e.target.blur()}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                )}

                                {/* SELECT dropdown */}
                                {field.specType === "SELECT" && (
                                    <select
                                        value={specs[field.specKey] || ""}
                                        onChange={e => handleChange(field.specKey, e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select {field.specLabel}</option>
                                        {field.options?.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                )}

                                {/* SIZE_SELECTOR - chips/buttons (multi-select for available sizes) */}
                                {field.specType === "SIZE_SELECTOR" && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">Select all available sizes for this product:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {field.options?.map(size => {
                                                const selected = (specs[field.specKey] || []).includes(size);
                                                return (
                                                    <button
                                                        key={size}
                                                        type="button"
                                                        onClick={() => handleSizeToggle(field.specKey, size)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all
                                                            ${selected
                                                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                                                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                                                            }`}
                                                    >
                                                        {size}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* COLOR_PICKER - color swatches (multi-select) */}
                                {field.specType === "COLOR_PICKER" && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">Select all available colors:</p>
                                        <div className="flex flex-wrap gap-3">
                                            {field.options?.map(color => {
                                                const selected = (specs[field.specKey] || []).includes(color);
                                                const hex = colorMap[color.toLowerCase()] || "#888";
                                                const isGradient = hex.startsWith("linear");
                                                return (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        onClick={() => handleColorToggle(field.specKey, color)}
                                                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all
                                                            ${selected
                                                                ? "border-blue-600 bg-blue-50 shadow-md"
                                                                : "border-gray-200 hover:border-gray-400"
                                                            }`}
                                                    >
                                                        <div
                                                            className="w-8 h-8 rounded-full border border-gray-300 shadow-inner"
                                                            style={{
                                                                background: isGradient ? hex : hex,
                                                                backgroundColor: isGradient ? undefined : hex,
                                                            }}
                                                        />
                                                        <span className="text-xs text-gray-600">{color}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
