package com.ecommerce.project.repository;

import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.Product;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {
    Page<Product> findByCategoryOrderByPriceAsc(Category category, Pageable pageDetails);

    Page<Product> findByProductNameLikeIgnoreCase(String keyword, Pageable pageDetails);

    @Query("""
       SELECT p FROM Product p
       WHERE (:category IS NULL OR p.category.categoryName = :category)
       AND (:rating IS NULL OR p.rating >= :rating)
       AND (:minPrice IS NULL OR p.specialPrice >= :minPrice)
       AND (:maxPrice IS NULL OR p.specialPrice <= :maxPrice)
       AND (:featured IS NULL OR p.featured = :featured)
       AND (:bestSeller IS NULL OR p.bestSeller = :bestSeller)
    """)
    Page<Product> filterProducts(
            @Param("category") String category,
            @Param("rating") Integer rating,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("featured") Boolean featured,
            @Param("bestSeller") Boolean bestSeller,
            Pageable pageable
    );

    // Get products of a specific micro category
    List<Product> findByCategoryCategoryId(Long categoryId);

    // Get all products under a main or sub category
    List<Product> findByCategoryIn(List<Category> categories);

    boolean existsBySku(String sku);

    boolean existsByProductNameIgnoreCaseAndCategoryCategoryId(@NotBlank(message = "Product name must not be empty") String productName, Long categoryId);

    Page<Product> findByUser_UserId(Long sellerId, Pageable pageDetails);
}
