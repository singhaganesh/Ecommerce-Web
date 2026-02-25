/**
 * SpecificationsTable — Renders product specifications in grouped, organized rows.
 * Reads from the product.specifications JSON and displays them dynamically.
 * 
 * Filters out variant keys (like size, color arrays) since those are shown via VariantSelector.
 */
export default function SpecificationsTable({ specifications, title = "Specifications" }) {
    if (!specifications || Object.keys(specifications).length === 0) {
        return null;
    }

    // Filter out variant arrays (sizes, colors) — they're rendered by VariantSelector
    const filteredSpecs = Object.entries(specifications).filter(([key, value]) => {
        return !Array.isArray(value);
    });

    if (filteredSpecs.length === 0) return null;

    // Format key from snake_case/camelCase to Title Case
    const formatKey = (key) => {
        return key
            .replace(/_/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/\b\w/g, c => c.toUpperCase())
            .trim();
    };

    return (
        <div className="bg-white rounded-xl border p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1">
                {filteredSpecs.map(([key, value]) => (
                    <div key={key} className="flex border-b border-gray-100 py-3">
                        <span className="text-gray-500 w-2/5 text-sm">{formatKey(key)}</span>
                        <span className="text-gray-900 font-medium w-3/5">{String(value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
