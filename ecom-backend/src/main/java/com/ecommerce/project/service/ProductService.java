package com.ecommerce.project.service;

import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.payload.ProductResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductService {

    ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductResponse searchProductByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductResponse searchProductByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductDTO updateProduct(ProductDTO product, Long productId);

    void deleteProduct(Long productId);

    ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException;

    ProductResponse getFilterProduct(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String category, Integer rating, Double minPrice, Double maxPrice, Boolean featured, Boolean bestSeller);

    // Updated to accept image URLs instead of MultipartFile for Cloudinary integration
    ProductDTO createProduct(ProductDTO productDTO, Long categoryId, Long sellerId, List<String> imageUrls) throws IOException;

    ProductResponse getProductsBySeller(Long sellerId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    java.util.Map<String, Object> getSellerProductStatistics(Long sellerId);

    // Updated to accept image URLs for Cloudinary integration
    ProductDTO updateSellerProduct(Long productId, ProductDTO productDTO, List<String> newImageUrls, List<String> existingImages) throws IOException;
}
