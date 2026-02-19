import { useState, useCallback, useEffect } from 'react';
import { FaCloudUploadAlt, FaTimes, FaSpinner } from 'react-icons/fa';
import { uploadImageToCloudinary } from '../utils/cloudinary';

const ImageUploader = ({
  onImagesUploaded,
  maxImages = 5,
  folder = '',
  existingImages = []
}) => {
  const [images, setImages] = useState(existingImages);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Sync with existingImages when provided (for edit mode)
  useEffect(() => {
    if (existingImages && existingImages.length > 0 && images.length === 0) {
      setImages(existingImages);
    }
  }, [existingImages]);

  // Notify parent whenever images change
  useEffect(() => {
    if (images.length > 0) {
      onImagesUploaded(images);
    }
  }, [images, onImagesUploaded]);

  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.localUrl && image.localUrl.startsWith('blob:')) {
          URL.revokeObjectURL(image.localUrl);
        }
      });
    };
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    // Step 1: Create local previews for all files first
    const newImagesWithPreviews = filesToUpload.map((file, i) => {
      const localPreviewUrl = URL.createObjectURL(file);
      return {
        localUrl: localPreviewUrl,
        url: '',
        publicId: '',
        isPrimary: images.length === 0 && i === 0,
        fileName: file.name,
        uploading: true,
        error: null
      };
    });

    // Step 2: Show local previews immediately
    // Append new images to the existing list
    setImages(prevImages => [...prevImages, ...newImagesWithPreviews]);
    setUploading(true); // Global uploading state (optional, can be removed if not used)

    // Step 3: Upload each file to Cloudinary
    // We process uploads sequentially to avoid updating state concurrently in a way that might cause race conditions
    // or we can use Promise.all if we are careful with state updates. 
    // Here we iterate and update state for each completion.

    // We need to know the starting index for these new images in the master 'images' array
    // However, 'images' state might not be updated yet inside this loop if we used functional update above.
    // So we'll maintain a reference to the index relative to the *current* batch.

    const baseIndex = images.length; // The index where the first new image was added

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      // The index of this image in the global 'images' state array (presuming no other updates happened)
      const targetIndex = baseIndex + i;
      const localUrl = newImagesWithPreviews[i].localUrl;

      try {
        const result = await uploadImageToCloudinary(file, folder);

        // Update state based on result
        setImages(prev => {
          return prev.map((img, idx) => {
            if (idx === targetIndex) {
              if (result.success) {
                return {
                  ...img,
                  url: result.url,
                  publicId: result.publicId,
                  uploading: false,
                  error: null
                };
              } else {
                return {
                  ...img,
                  uploading: false,
                  error: result.error || 'Upload failed'
                };
              }
            }
            return img;
          });
        });

        if (result.success) {
          // Clean up blob URL after successful upload to free memory
          URL.revokeObjectURL(localUrl);
        }

      } catch (error) {
        // This catch block handles unexpected errors in the logic above
        console.error("Critical upload error:", error);
        setImages(prev => {
          return prev.map((img, idx) => {
            if (idx === targetIndex) {
              return {
                ...img,
                uploading: false,
                error: "Unexpected upload error"
              };
            }
            return img;
          });
        });
      }
    }

    setUploading(false);
  };

  const removeImage = (index) => {
    const imageToRemove = images[index];
    // Cleanup blob URL if it's a local preview
    if (imageToRemove.localUrl && imageToRemove.localUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.localUrl);
    }

    const updatedImages = images.filter((_, i) => i !== index);

    // If we removed the primary image, set the first remaining as primary
    if (images[index].isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }

    setImages(updatedImages);
    onImagesUploaded(updatedImages);
  };

  const setPrimaryImage = (index) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    setImages(updatedImages);
    onImagesUploaded(updatedImages);
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
            disabled={uploading}
          />

          <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />

          <p className="text-lg font-medium text-gray-700 mb-2">
            {uploading ? 'Uploading...' : 'Drop images here or click to upload'}
          </p>

          <p className="text-sm text-gray-500">
            PNG, JPG, WEBP up to 5MB ({images.length}/{maxImages} images)
          </p>

          {uploading && (
            <div className="mt-4 flex justify-center">
              <FaSpinner className="animate-spin text-blue-600 h-6 w-6" />
            </div>
          )}
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative group rounded-lg overflow-hidden border-2 ${image.isPrimary ? 'border-blue-500' : 'border-gray-200'
                }`}
            >
              {/* Image Display - Show local preview or Cloudinary URL */}
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 rounded-t-lg">
                {(image.localUrl || image.url) ? (
                  <img
                    src={image.localUrl || image.url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs text-center px-2">Loading...</span>
                )}
              </div>

              {/* Upload Progress Overlay */}
              {image.uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <FaSpinner className="animate-spin text-white h-6 w-6 mb-1" />
                    <span className="text-white text-xs">Uploading...</span>
                  </div>
                </div>
              )}

              {/* Error Overlay */}
              {image.error && (
                <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <span className="text-white text-xs text-center px-2">Upload failed</span>
                    <span className="text-white text-xs mt-1">{image.error}</span>
                  </div>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200">
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTimes size={14} />
                </button>

                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}

                {/* Set Primary Button */}
                {!image.isPrimary && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrimaryImage(index);
                    }}
                    className="absolute bottom-2 left-2 right-2 bg-white text-gray-700 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Set as Primary
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helper Text */}
      {images.length > 0 && (
        <p className="mt-4 text-sm text-gray-500 text-center">
          {images.length < maxImages
            ? `You can upload ${maxImages - images.length} more image${maxImages - images.length !== 1 ? 's' : ''}`
            : `Maximum ${maxImages} images reached. Delete an image to upload more.`}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
