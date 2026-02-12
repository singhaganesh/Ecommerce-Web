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
    const updatedImages = [...images, ...newImagesWithPreviews];
    setImages(updatedImages);
    setUploading(true);

    // Step 3: Upload each file to Cloudinary
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const targetIndex = images.length + i;
      const localUrl = newImagesWithPreviews[i].localUrl;

      try {
        const result = await uploadImageToCloudinary(file, folder);

        if (result.success) {
          // Update state with Cloudinary URL
          setImages(prev => {
            const updated = prev.map((img, idx) => {
              if (idx === targetIndex) {
                return {
                  ...img,
                  url: result.url,
                  publicId: result.publicId,
                  uploading: false,
                  error: null
                };
              }
              return img;
            });
            return updated;
          });
          // Clean up blob URL after successful upload
          URL.revokeObjectURL(localUrl);
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } catch (error) {
        // Mark as error but keep local preview
        setImages(prev => {
          const updated = prev.map((img, idx) => {
            if (idx === targetIndex) {
              return {
                ...img,
                uploading: false,
                error: error.message
              };
            }
            return img;
          });
          return updated;
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
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            dragActive 
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
              className={`relative group rounded-lg overflow-hidden border-2 ${
                image.isPrimary ? 'border-blue-500' : 'border-gray-200'
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
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <FaSpinner className="animate-spin text-white h-6 w-6 mb-1" />
                    <span className="text-white text-xs">Uploading...</span>
                  </div>
                </div>
              )}
               
              {/* Error Overlay */}
              {image.error && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-70 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <span className="text-white text-xs text-center px-2">Upload failed</span>
                    <span className="text-white text-xs mt-1">{image.error}</span>
                  </div>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200">
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
