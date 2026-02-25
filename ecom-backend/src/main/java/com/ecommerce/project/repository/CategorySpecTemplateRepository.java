package com.ecommerce.project.repository;

import com.ecommerce.project.model.CategorySpecTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategorySpecTemplateRepository extends JpaRepository<CategorySpecTemplate, Long> {

    List<CategorySpecTemplate> findByCategoryCategoryIdOrderByDisplayOrderAsc(Long categoryId);

    void deleteByCategoryCategoryId(Long categoryId);

    boolean existsByCategoryCategoryId(Long categoryId);
}
