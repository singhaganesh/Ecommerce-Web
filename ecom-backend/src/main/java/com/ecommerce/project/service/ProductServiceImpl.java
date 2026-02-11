package com.ecommerce.project.service;

import com.ecommerce.project.exception.APIException;
import com.ecommerce.project.exception.ResourceNotFoundException;
import com.ecommerce.project.model.*;
import com.ecommerce.project.payload.CartDTO;
import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.payload.ProductResponse;
import com.ecommerce.project.repository.*;
import com.ecommerce.project.util.ImageUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService{

    private final CartService cartService;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;
    private final FileService fileService;
    private final ImageUtils imageUtils;
    private final UserRepository userRepository;
    private final SkuGeneratorService skuGeneratorService;
    private final ProductImageRepository productImageRepository;

    @Value("${project.image}")
    private String path;

    public ProductServiceImpl(CartService cartService,
                              CartRepository cartRepository,
                              ProductRepository productRepository,
                              CategoryRepository categoryRepository,
                              ModelMapper modelMapper,
                              FileService fileService,
                              ImageUtils imageUtils, UserRepository userRepository,
                              SkuGeneratorService skuGeneratorService,
                              ProductImageRepository productImageRepository) {
        this.cartService = cartService;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.modelMapper = modelMapper;
        this.fileService = fileService;
        this.imageUtils = imageUtils;
        this.userRepository = userRepository;
        this.skuGeneratorService = skuGeneratorService;
        this.productImageRepository = productImageRepository;
    }


    @Override
    @Transactional  // Add this to ensure the entire operation (including cascaded saves) is transactional
    public ProductDTO createProduct(
            ProductDTO productDTO,
            Long categoryId,
            Long sellerId,
            List<MultipartFile> images
    ) throws IOException {

        System.out.println("Product DTO received: " + productDTO);  // Add logging for debugging

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("User","userId",sellerId));

        if (!seller.hasRole(AppRole.ROLE_SELLER)) {
            throw new APIException("Only sellers can create products");
        }

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category","categoryId",categoryId));

        if (category.getChildren() != null && !category.getChildren().isEmpty()) {
            throw new APIException("Select a MICRO category only");
        }

        Product product = modelMapper.map(productDTO, Product.class);

        String sku = skuGeneratorService.generateUniqueSku(
                category.getCategoryName(),
                productDTO.getBrand(),
                productDTO.getProductName()
        );

        product.setSku(sku);
        product.setCategory(category);
        product.setUser(seller);
        product.setFeatured(false);
        product.setRating(0.0);
        product.setTotalReviews(0);
        product.setActive(true);
        product.setSoldCount(0);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);

        // 🔥 IMAGE HANDLING
        List<ProductImage> imageEntities = new ArrayList<>();
        int position = 1;

        for (MultipartFile file : images) {
            String fileName = fileService.uploadImage(path, file);

            System.out.println("Uploaded image file: " + fileName);  // Add logging for debugging

            ProductImage image = new ProductImage();
            image.setImageUrl(fileName);
            image.setPrimaryImage(position == 1); // first image is primary
            image.setPosition(position++);
            image.setProduct(savedProduct);

            imageEntities.add(image);
        }

        savedProduct.setImages(imageEntities);
        Product finalSavedProduct = productRepository.save(savedProduct);  // Re-save to ensure cascade

        System.out.println("Saved product with " + imageEntities.size() + " images");  // Add logging

        // Map to DTO
        ProductDTO response = modelMapper.map(finalSavedProduct, ProductDTO.class);
        response.setImages(
                imageEntities.stream()
                        .map(ProductImage::getImageUrl)
                        .toList()
        );

        response.setPrimaryImage(
                imageEntities.stream()
                        .filter(ProductImage::isPrimaryImage)
                        .map(ProductImage::getImageUrl)
                        .findFirst()
                        .orElse(null)
        );

        return response;
    }
    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductsBySeller(
            Long sellerId,
            Integer pageNumber,
            Integer pageSize,
            String sortBy,
            String sortOrder
    ) {

        Sort sort = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Product> pageProduct =
                productRepository.findByUser_UserId(sellerId, pageable);

        List<ProductDTO> productDTOS = pageProduct.getContent().stream()
                .map(product -> {

                    ProductDTO dto = modelMapper.map(product, ProductDTO.class);

                    // 🔥 Fetch images
                    List<ProductImage> images = product.getImages();

                    if (images != null && !images.isEmpty()) {

                        // All images
                        dto.setImages(
                                images.stream()
                                        .map(img -> imageUtils.constructImageUrl(img.getImageUrl()))
                                        .toList()
                        );

                        // Primary image
                        dto.setPrimaryImage(
                                images.stream()
                                        .filter(ProductImage::isPrimaryImage)
                                        .map(img -> imageUtils.constructImageUrl(img.getImageUrl()))
                                        .findFirst()
                                        .orElse(null)
                        );
                    } else {
                        dto.setImages(List.of());
                        dto.setPrimaryImage(null);
                    }

                    return dto;
                })
                .toList();

        ProductResponse response = new ProductResponse();
        response.setContent(productDTOS);
        response.setPageNumber(pageProduct.getNumber());
        response.setPageSize(pageProduct.getSize());
        response.setTotalElements(pageProduct.getTotalElements());
        response.setTotalPages(pageProduct.getTotalPages());
        response.setLastPage(pageProduct.isLast());

        return response;
    }



    @Override
    public ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Product> pageProduct = productRepository.findAll(pageDetails);

        List<Product> products = pageProduct.getContent();
        List<ProductDTO> productDTOS = products.stream()
                .map(product ->{
                    ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
//                    productDTO.setImage(imageUtils.constructImageUrl(product.getImage()));
                    return productDTO;
                })
                .toList();

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOS);
        productResponse.setPageNumber(pageProduct.getNumber());
        productResponse.setPageSize(pageProduct.getSize());
        productResponse.setTotalElements(pageProduct.getTotalElements());
        productResponse.setTotalPages(pageProduct.getTotalPages());
        productResponse.setLastPage(pageProduct.isLast());
        return productResponse;
    }
    @Override
    public ProductResponse getFilterProduct(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String category, Integer rating, Double minPrice, Double maxPrice, Boolean featured, Boolean bestSeller) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Product> pageProduct = productRepository.filterProducts(category,rating,minPrice,maxPrice,featured,bestSeller,pageDetails);

        List<Product> products = pageProduct.getContent();
        List<ProductDTO> productDTOS = products.stream()
                .map(product ->{
                    ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
//                    productDTO.setImage(imageUtils.constructImageUrl(product.getImage()));
                    return productDTO;
                })
                .toList();


        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOS);
        productResponse.setPageNumber(pageProduct.getNumber());
        productResponse.setPageSize(pageProduct.getSize());
        productResponse.setTotalElements(pageProduct.getTotalElements());
        productResponse.setTotalPages(pageProduct.getTotalPages());
        productResponse.setLastPage(pageProduct.isLast());
        return productResponse;
    }

    @Override
    public ProductResponse searchProductByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category","categoryId",categoryId));
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Product> pageProduct = productRepository.findByCategoryOrderByPriceAsc(category,pageDetails);

        List<Product> products = pageProduct.getContent();

        List<ProductDTO> productDTOS = products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .toList();

        if (products.isEmpty()){
            throw new APIException(category.getCategoryName() +" category does not have any product");
        }

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOS);
        productResponse.setPageNumber(pageProduct.getNumber());
        productResponse.setPageSize(pageProduct.getSize());
        productResponse.setTotalElements(pageProduct.getTotalElements());
        productResponse.setTotalPages(pageProduct.getTotalPages());
        productResponse.setLastPage(pageProduct.isLast());
        return productResponse;
    }

    @Override
    public ProductResponse searchProductByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {

        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Product> pageProduct = productRepository.findByProductNameLikeIgnoreCase('%' + keyword + '%',pageDetails);

        List<Product> products = pageProduct.getContent();
        List<ProductDTO> productDTOS = products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .toList();

        if (products.isEmpty()){
            throw new APIException("Product not found with keyword: "+keyword);
        }

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOS);
        productResponse.setPageNumber(pageProduct.getNumber());
        productResponse.setPageSize(pageProduct.getSize());
        productResponse.setTotalElements(pageProduct.getTotalElements());
        productResponse.setTotalPages(pageProduct.getTotalPages());
        productResponse.setLastPage(pageProduct.isLast());
        return productResponse;
    }

    @Override
    public ProductDTO updateProduct(ProductDTO productDTO, Long productId) {
        // Get the existing product form DB
        Product productFormBD = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product","productId",productId));
        Product product = modelMapper.map(productDTO,Product.class);
        // Update the product info with the one in request body
        productFormBD.setProductName(product.getProductName());
        productFormBD.setDescription(product.getDescription());
        productFormBD.setQuantity(product.getQuantity());
        productFormBD.setDiscount(product.getDiscount());
        productFormBD.setPrice(product.getPrice());
        productFormBD.setSpecialPrice(product.getPrice() -
                ((product.getDiscount() * 0.01) * product.getPrice()));

        // Save to database
        Product saveProduct = productRepository.save(productFormBD);

        // Update Cart
        List<Cart> carts = cartRepository.findCartsByProductId(productId);

        List<CartDTO> cartDTOs = carts.stream().map(cart -> {
            CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);

            List<ProductDTO> products = cart.getCartItems().stream()
                    .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class)).collect(Collectors.toList());

            cartDTO.setProducts(products);

            return cartDTO;

        }).collect(Collectors.toList());

        cartDTOs.forEach(cart -> cartService.updateProductInCarts(cart.getCartId(), productId));

        return modelMapper.map(saveProduct,ProductDTO.class);
    }

    @Override
    public ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException {
        // Get the product form DB
        Product productFormDB = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product","productId",productId));
        // Upload image to server
        // Get the file name of uploaded image
        String fileName = fileService.uploadImage(path,image);

        // Updating the new file name to the product
//        productFormDB.setImage(fileName);
        // Save updated product
        Product updatedProduct = productRepository.save(productFormDB);
        // return DTO after mapping product to DTO

        return modelMapper.map(updatedProduct,ProductDTO.class);
    }

    @Override
    public Map<String, Object> getSellerProductStatistics(Long sellerId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Total products
        long totalProducts = productRepository.countByUser_UserId(sellerId);
        stats.put("totalProducts", totalProducts);
        
        // Out of stock (quantity = 0)
        long outOfStock = productRepository.countByUser_UserIdAndQuantity(sellerId, 0);
        stats.put("outOfStock", outOfStock);
        
        // Low stock (quantity > 0 AND quantity < 10)
        long lowStock = productRepository.countLowStockBySellerId(sellerId, 10);
        stats.put("lowStock", lowStock);
        
        return stats;
    }

    @Override
    @Transactional
    public ProductDTO updateSellerProduct(Long productId, ProductDTO productDTO, 
                                          List<MultipartFile> newImages, List<String> existingImages) throws IOException {
        System.out.println("=== UPDATE PRODUCT DEBUG ===");
        System.out.println("ProductId: " + productId);
        System.out.println("New images count: " + (newImages != null ? newImages.size() : 0));
        System.out.println("Existing images count: " + (existingImages != null ? existingImages.size() : 0));
        
        // Find the product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
        
        System.out.println("Found product: " + product.getProductName());
        System.out.println("Current quantity in DB: " + product.getQuantity());
        System.out.println("Quantity from DTO: " + productDTO.getQuantity());
        System.out.println("Current images count: " + product.getImages().size());
        
        // Update editable fields
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setDiscount(productDTO.getDiscount());
        product.setSpecialPrice(productDTO.getSpecialPrice());
        product.setQuantity(productDTO.getQuantity());
        product.setUpdatedAt(LocalDateTime.now());
        
        System.out.println("Updated fields - Price: " + productDTO.getPrice() + ", New Qty: " + productDTO.getQuantity());
        
        // Handle images
        List<ProductImage> currentImages = new ArrayList<>(product.getImages());
        
        // Extract just filenames from full URLs in existingImages
        List<String> existingImageFileNames = existingImages.stream()
                .map(url -> {
                    // Extract filename from full URL (e.g., http://localhost:8080/images/abc.jpg -> abc.jpg)
                    int lastSlash = url.lastIndexOf('/');
                    return lastSlash >= 0 ? url.substring(lastSlash + 1) : url;
                })
                .collect(Collectors.toList());
        
        System.out.println("Extracted filenames to keep: " + existingImageFileNames);
        
        // Remove images that are not in existingImages list
        List<ProductImage> imagesToRemove = currentImages.stream()
                .filter(img -> !existingImageFileNames.contains(img.getImageUrl()))
                .collect(Collectors.toList());
        
        for (ProductImage img : imagesToRemove) {
            product.getImages().remove(img);
            productImageRepository.delete(img);
            // Optionally delete file from disk
            // fileService.deleteImage(path, img.getImageUrl());
        }
        
        // Add new images
        if (newImages != null && !newImages.isEmpty()) {
            int startPosition = product.getImages().size() + 1;
            for (int i = 0; i < newImages.size(); i++) {
                MultipartFile file = newImages.get(i);
                String fileName = fileService.uploadImage(path, file);
                
                ProductImage image = new ProductImage();
                image.setImageUrl(fileName);
                image.setPrimaryImage(startPosition + i == 1 && product.getImages().isEmpty()); // Primary if first image
                image.setPosition(startPosition + i);
                image.setProduct(product);
                
                product.getImages().add(image);
            }
        }
        
        // If no primary image exists, set the first one as primary
        boolean hasPrimary = product.getImages().stream().anyMatch(ProductImage::isPrimaryImage);
        if (!hasPrimary && !product.getImages().isEmpty()) {
            product.getImages().get(0).setPrimaryImage(true);
        }
        
        Product updatedProduct = productRepository.save(product);
        
        // Manually create DTO to avoid ModelMapper overwriting fields
        ProductDTO response = new ProductDTO();
        response.setProductId(updatedProduct.getProductId());
        response.setProductName(updatedProduct.getProductName());
        response.setSku(updatedProduct.getSku());
        response.setDescription(updatedProduct.getDescription());
        response.setPrice(updatedProduct.getPrice());
        response.setDiscount(updatedProduct.getDiscount());
        response.setSpecialPrice(updatedProduct.getSpecialPrice());
        response.setQuantity(updatedProduct.getQuantity());
        response.setRating(updatedProduct.getRating());
        response.setTotalReviews(updatedProduct.getTotalReviews());
        response.setSoldCount(updatedProduct.getSoldCount());
        response.setActive(updatedProduct.getActive());
        response.setFeatured(updatedProduct.getFeatured());
        response.setBestSeller(updatedProduct.isBestSeller());
        response.setCreatedAt(updatedProduct.getCreatedAt());
        response.setUpdatedAt(updatedProduct.getUpdatedAt());
        
        // Handle category
        if (updatedProduct.getCategory() != null) {
            response.setCategoryName(updatedProduct.getCategory().getCategoryName());
        }
        
        // Handle brand
        if (updatedProduct.getBrand() != null) {
            response.setBrand(updatedProduct.getBrand());
        }
        
        // Handle images
        List<String> imageUrls = updatedProduct.getImages().stream()
                .map(img -> imageUtils.constructImageUrl(img.getImageUrl()))
                .collect(Collectors.toList());
        response.setImages(imageUrls);
        
        // Set primary image
        String primaryImage = updatedProduct.getImages().stream()
                .filter(ProductImage::isPrimaryImage)
                .map(img -> imageUtils.constructImageUrl(img.getImageUrl()))
                .findFirst()
                .orElse(null);
        response.setPrimaryImage(primaryImage);
        
        return response;
    }

    @Override
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
        
        // Delete all associated images first
        List<ProductImage> images = product.getImages();
        for (ProductImage image : images) {
            productImageRepository.delete(image);
            // Optionally delete the image file from disk
            // fileService.deleteImage(path, image.getImageUrl());
        }
        
        // Delete the product
        productRepository.delete(product);
    }


}
