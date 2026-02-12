// Cloudinary Configuration
// Credentials provided by user
const CLOUDINARY_CONFIG = {
  cloudName: 'dapurdqgd',
  uploadPreset: 'ecomm-product-images',
  apiUrl: 'https://api.cloudinary.com/v1_1/dapurdqgd/image/upload'
};

/**
 * Upload image to Cloudinary
 * @param {File} file - The image file to upload
 * @param {string} folder - Optional folder path (e.g., 'products/123')
 * @returns {Promise<Object>} - Upload result with secure_url and public_id
 */
export const uploadImageToCloudinary = async (file, folder = '') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  
  if (folder) {
    formData.append('folder', folder);
  }

  try {
    const response = await fetch(CLOUDINARY_CONFIG.apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height,
      bytes: data.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {File[]} files - Array of image files
 * @param {string} folder - Optional folder path
 * @returns {Promise<Array>} - Array of upload results
 */
export const uploadMultipleImages = async (files, folder = '') => {
  const uploadPromises = files.map(file => uploadImageToCloudinary(file, folder));
  const results = await Promise.all(uploadPromises);
  return results;
};

/**
 * Get optimized image URL from Cloudinary
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized URL
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const {
    width = 800,
    height = null,
    quality = 80,
    format = 'auto',
    crop = 'limit'
  } = options;

  // Parse the URL to insert transformations
  const urlParts = url.split('/upload/');
  if (urlParts.length !== 2) return url;

  let transformationString = `w_${width},q_${quality},f_${format},c_${crop}`;
  if (height) {
    transformationString += `,h_${height}`;
  }

  return `${urlParts[0]}/upload/${transformationString}/${urlParts[1]}`;
};

/**
 * Get thumbnail URL
 * @param {string} url - Original Cloudinary URL
 * @returns {string} - Thumbnail URL (200x200)
 */
export const getThumbnailUrl = (url) => {
  return getOptimizedImageUrl(url, {
    width: 200,
    height: 200,
    crop: 'fill',
    quality: 70
  });
};

/**
 * Get product card image URL
 * @param {string} url - Original Cloudinary URL
 * @returns {string} - Optimized URL (400x400)
 */
export const getProductCardUrl = (url) => {
  return getOptimizedImageUrl(url, {
    width: 400,
    height: 400,
    crop: 'fill',
    quality: 80
  });
};

export default {
  uploadImageToCloudinary,
  uploadMultipleImages,
  getOptimizedImageUrl,
  getThumbnailUrl,
  getProductCardUrl
};
