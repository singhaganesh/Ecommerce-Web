export default function ImageGallery({
    allImages,
    selectedImage,
    setSelectedImage,
    productName,
    discount,
    layout = "horizontal" // 'horizontal' or 'vertical'
}) {

    if (layout === "vertical") {
        return (
            <div className="flex flex-col-reverse lg:flex-row gap-4">
                {/* Thumbnails */}
                <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:h-[600px] scrollbar-hide py-2 lg:py-0">
                    {allImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all p-1 bg-white
                                ${selectedImage === index ? "border-indigo-600 opacity-100" : "border-gray-200 opacity-70 hover:opacity-100"}`}
                        >
                            <img src={img} alt="" className="w-full h-full object-contain" />
                        </button>
                    ))}
                </div>

                {/* Main Image */}
                <div className="flex-1 aspect-[3/4] lg:h-[600px] rounded-2xl overflow-hidden bg-white border shadow-sm relative flex items-center justify-center p-4">
                    <img
                        src={allImages[selectedImage]}
                        alt={productName}
                        className="max-w-full max-h-full object-contain"
                    />
                    {discount > 0 && (
                        <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider shadow-sm">
                            {discount}% OFF
                        </span>
                    )}
                </div>
            </div>
        );
    }

    // Horizontal Layout (Default)
    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="aspect-square lg:aspect-video bg-white rounded-xl border p-8 flex items-center justify-center relative overflow-hidden shadow-sm">
                <img
                    src={allImages[selectedImage]}
                    alt={productName}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                />
                {discount > 0 && (
                    <span className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-sm">
                        Save {discount}%
                    </span>
                )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-24 h-24 bg-white rounded-lg border-2 p-2 flex items-center justify-center transition-all
                            ${selectedImage === index ? "border-indigo-600" : "border-gray-200 hover:border-gray-300"}`}
                    >
                        <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                    </button>
                ))}
            </div>
        </div>
    );
}
