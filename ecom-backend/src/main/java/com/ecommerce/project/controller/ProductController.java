package com.ecommerce.project.controller;

import com.ecommerce.project.config.AppConstants;
import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.payload.ProductResponse;
import com.ecommerce.project.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Create product with Cloudinary image URLs
     * Images are uploaded to Cloudinary from frontend first, then URLs are sent here
     */
    @PostMapping(
            value = "/seller/categories/{categoryId}/{sellerId}/product",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ProductDTO> createProduct(
            @RequestBody @Valid ProductDTO productDTO,
            @PathVariable Long categoryId,
            @PathVariable Long sellerId
    ) throws IOException {
        
        System.out.println("Creating product with Cloudinary URLs");
        System.out.println("Product: " + productDTO.getProductName());
        System.out.println("Images: " + productDTO.getImages());

        // Images URLs are already in productDTO.getImages() from Cloudinary
        List<String> imageUrls = productDTO.getImages() != null ? productDTO.getImages() : new ArrayList<>();

        ProductDTO createdProduct =
                productService.createProduct(productDTO, categoryId, sellerId, imageUrls);

        return ResponseEntity.ok(createdProduct);
    }

    @GetMapping("/public/products/filter")
    public ResponseEntity<ProductResponse> getFilterProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean bestSeller,
            @RequestParam(name = "pageNumber",defaultValue = AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE,required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY,required = false) String sortBy,
            @RequestParam(name = "sortOrder",defaultValue = AppConstants.SORT_DIR,required = false) String sortOrder){
        ProductResponse productResponse = productService.getFilterProduct(pageNumber,pageSize,sortBy,sortOrder,category,rating,minPrice,maxPrice,featured,bestSeller);
        return new ResponseEntity<>(productResponse,HttpStatus.OK);
    }

    @GetMapping("seller/{sellerId}/products")
    public ResponseEntity<ProductResponse> getProductsBySeller(@PathVariable Long sellerId,
                                                              @RequestParam(name = "pageNumber",defaultValue = AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
                                                              @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE,required = false) Integer pageSize,
                                                              @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY,required = false) String sortBy,
                                                              @RequestParam(name = "sortOrder",defaultValue = AppConstants.SORT_DIR,required = false) String sortOrder){
        ProductResponse productResponse = productService.getProductsBySeller(sellerId,pageNumber,pageSize,sortBy,sortOrder);
        return new ResponseEntity<>(productResponse,HttpStatus.OK);
    }

    @GetMapping("/public/products")
    public ResponseEntity<ProductResponse> getAllProducts(
            @RequestParam(name = "pageNumber",defaultValue = AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE,required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY,required = false) String sortBy,
            @RequestParam(name = "sortOrder",defaultValue = AppConstants.SORT_DIR,required = false) String sortOrder){
        ProductResponse productResponse = productService.getAllProducts(pageNumber,pageSize,sortBy,sortOrder);
        return new ResponseEntity<>(productResponse,HttpStatus.OK);
    }

    @GetMapping("/public/categories/{categoryId}/products")
    public ResponseEntity<ProductResponse> getProductsByCategory(@PathVariable Long categoryId,
                                                                 @RequestParam(name = "pageNumber",defaultValue = AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
                                                                 @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE,required = false) Integer pageSize,
                                                                 @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY,required = false) String sortBy,
                                                                 @RequestParam(name = "sortOrder",defaultValue = AppConstants.SORT_DIR,required = false) String sortOrder){
        ProductResponse productResponse = productService.searchProductByCategory(categoryId,pageNumber,pageSize,sortBy,sortOrder);
        return new ResponseEntity<>(productResponse,HttpStatus.OK);
    }
    
    @GetMapping("/public/products/{keyword}")
    public ResponseEntity<ProductResponse> getProductsByKeyword(@PathVariable String keyword,
                                                                @RequestParam(name = "pageNumber",defaultValue = AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
                                                                @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE,required = false) Integer pageSize,
                                                                @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY,required = false) String sortBy,
                                                                @RequestParam(name = "sortOrder",defaultValue = AppConstants.SORT_DIR,required = false) String sortOrder){
        ProductResponse productResponse = productService.searchProductByKeyword(keyword,pageNumber,pageSize,sortBy,sortOrder);
        return new ResponseEntity<>(productResponse,HttpStatus.FOUND);
    }
    
    @PutMapping("/admin/products/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(@Valid @RequestBody ProductDTO productDTO,
                                                        @PathVariable Long productId){
        ProductDTO updatedProductDTO = productService.updateProduct(productDTO,productId);
        return new ResponseEntity<>(updatedProductDTO,HttpStatus.OK);
    }

    @DeleteMapping("/admin/products/{productId}")
    public ResponseEntity<String> deleteAdminProduct(@PathVariable Long productId){
        productService.deleteProduct(productId);
        return new ResponseEntity<>("Product deleted successfully", HttpStatus.OK);
    }
    
    @PutMapping("admin/products/{productId}/image")
    public ResponseEntity<ProductDTO> updateProductImage(@PathVariable Long productId,
                                                         @RequestParam("image")MultipartFile image) throws IOException {
        ProductDTO updatedProduct = productService.updateProductImage(productId,image);
        return new ResponseEntity<>(updatedProduct,HttpStatus.OK);
    }

    @GetMapping("/seller/{sellerId}/products/stats")
    public ResponseEntity<java.util.Map<String, Object>> getSellerProductStats(@PathVariable Long sellerId){
        java.util.Map<String, Object> stats = productService.getSellerProductStatistics(sellerId);
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    /**
     * Update product with Cloudinary image URLs
     * Receives new image URLs and existing image URLs
     */
    @PutMapping(
            value = "/seller/products/{productId}",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ProductDTO> updateSellerProduct(
            @PathVariable Long productId,
            @RequestBody @Valid ProductDTO productDTO
    ) throws IOException {

        System.out.println("Received update for product ID: " + productId);
        System.out.println("Images: " + productDTO.getImages());

        // Images URLs are in productDTO
        List<String> allImages = productDTO.getImages() != null ? productDTO.getImages() : new ArrayList<>();

        ProductDTO updatedProduct = productService.updateSellerProduct(
            productId, 
            productDTO, 
            allImages, 
            new ArrayList<>()
        );
        
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/seller/products/{productId}")
    public ResponseEntity<String> deleteSellerProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok("Product deleted successfully");
    }
}
