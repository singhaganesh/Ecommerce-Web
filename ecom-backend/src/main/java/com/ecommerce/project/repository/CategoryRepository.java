package com.ecommerce.project.repository;

import com.ecommerce.project.model.Category;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {

    Category findByCategoryNameIgnoreCase(@NotBlank(message = "Category name must not be empty") String categoryName);
    Optional<Category> findByCategoryName(String categoryName);

    boolean existsByCategoryName(String categoryName);
    // Main categories (parent = null)
    List<Category> findByParentIsNull();

    // Get children of any category
    List<Category> findByParentCategoryId(Long categoryId);
}
