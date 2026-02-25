package com.ecommerce.project.repository;

import com.ecommerce.project.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    List<ProductVariant> findByProductProductIdOrderByVariantIdAsc(Long productId);

    void deleteByProductProductId(Long productId);

    boolean existsByProductProductId(Long productId);

    boolean existsBySku(String sku);
}
