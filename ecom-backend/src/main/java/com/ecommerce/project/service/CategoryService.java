package com.ecommerce.project.service;

import com.ecommerce.project.payload.CategoryDTO;
import com.ecommerce.project.payload.CategoryResponse;
import com.ecommerce.project.payload.ProductDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


public interface CategoryService {

    CategoryResponse getAllCategories(Integer pageNumber,Integer pageSize,String sortBy,String sortOrder);

    CategoryDTO createCategory(CategoryDTO categoryDTO);

    CategoryDTO deleteCategory(Long categoryID);

    CategoryDTO updateCategory(CategoryDTO categoryDTO, Long categoryId);


    CategoryDTO updateCategoryImage(Long categoryId, MultipartFile image) throws IOException;

    List<CategoryDTO> saveAllCategories(List<CategoryDTO> categories);
}
