package com.ecommerce.project.service;

import com.ecommerce.project.exception.APIException;
import com.ecommerce.project.exception.ResourceNotFoundException;
import com.ecommerce.project.model.Category;
import com.ecommerce.project.payload.CategoryDTO;
import com.ecommerce.project.payload.CategoryResponse;
import com.ecommerce.project.repository.CategoryRepository;
import com.ecommerce.project.util.ImageUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService{

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;
    private final FileService fileService;
    private final ImageUtils imageUtils;

    @Value("${project.image}")
    private String path;

    public CategoryServiceImpl(CategoryRepository categoryRepository,
                               ModelMapper modelMapper,
                               FileService fileService,
                               ImageUtils imageUtils) {
        this.categoryRepository = categoryRepository;
        this.modelMapper = modelMapper;
        this.fileService = fileService;
        this.imageUtils = imageUtils;
    }

    @Override
    public CategoryResponse getAllCategories(Integer pageNumber,Integer pageSize,String sortBy,String sortOrder) {

        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Category> categoryPage = categoryRepository.findAll(pageDetails);

        List<Category> categories = categoryPage.getContent();
        if (categories.isEmpty()){
            throw new APIException("No category created till now");
        }
        List<CategoryDTO> categoryDTOS = categories.stream()
                .map(category ->{
                    CategoryDTO categoryDTO = modelMapper.map(category, CategoryDTO.class);
                    categoryDTO.setImage(imageUtils.constructImageUrl(category.getImage()));
                    return categoryDTO;
                })
                .toList();

        CategoryResponse categoryResponse = new CategoryResponse();
        categoryResponse.setContent(categoryDTOS);
        categoryResponse.setPageNumber(categoryPage.getNumber());
        categoryResponse.setPageSize(categoryPage.getSize());
        categoryResponse.setTotalElements(categoryPage.getTotalElements());
        categoryResponse.setTotalPages(categoryPage.getTotalPages());
        categoryResponse.setLastPage(categoryPage.isLast());

        return categoryResponse;
    }

    @Override
    public List<CategoryDTO> getParentCategories() {
        List<Category> categories = categoryRepository.findByParentIsNull();

        List<CategoryDTO> categoryDTOS = categories.stream()
                .map(category -> {
                    CategoryDTO categoryDTO = modelMapper.map(category, CategoryDTO.class);
                    categoryDTO.setImage(imageUtils.constructImageUrl(category.getImage()));
                    return categoryDTO;
                })
                .toList();

        return categoryDTOS;
    }

    @Override
    public List<CategoryDTO> getChildrenCategories(Long categoryId) {
        List<Category> categories = categoryRepository.findByParentCategoryId(categoryId);

        List<CategoryDTO> categoryDTOS = categories.stream()
                .map(category -> {
                    CategoryDTO categoryDTO = modelMapper.map(category, CategoryDTO.class);
                    categoryDTO.setImage(imageUtils.constructImageUrl(category.getImage()));
                    return categoryDTO;
                })
                .toList();
        return categoryDTOS;
    }



    @Override
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = modelMapper.map(categoryDTO,Category.class);
        Category categoryFromDB = categoryRepository.findByCategoryNameIgnoreCase(category.getCategoryName());

        if (categoryFromDB != null){
            throw new APIException("Category with the name "+categoryDTO.getCategoryName()+" already exists !!!");
        }
        category.setImage("default.png");
        category.setCreatedAt(LocalDateTime.now());
        category.setActive(true);
        Category savedCategory =  categoryRepository.save(category);

        return modelMapper.map(savedCategory, CategoryDTO.class);
    }

    @Override
    public CategoryDTO deleteCategory(Long categoryId) {

        Optional<Category> category = categoryRepository.findById(categoryId);
        if (category.isPresent()) {
            categoryRepository.deleteById(categoryId);
            return modelMapper.map(category.get(), CategoryDTO.class);
        } else {
            throw new ResourceNotFoundException("Category","categoryId",categoryId);
        }

    }

    @Override
    public CategoryDTO updateCategoryImage(Long categoryId, MultipartFile image) throws IOException {
        // Get the category form DB
        Category categoryFromDB = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category","categoryId",categoryId));

        // Upload image to server
        // Get the file name of uploaded image
        String fileName = fileService.uploadImage(path,image);

        // Updating the new file name to the product
        categoryFromDB.setImage(fileName);
        // Save updated product
        Category updatedCategory = categoryRepository.save(categoryFromDB);
        // return DTO after mapping product to DTO

        return modelMapper.map(updatedCategory,CategoryDTO.class);


    }

    
    @Override
    public List<CategoryDTO> saveAllCategories(List<CategoryDTO> categoryDTOList) {

        List<Category> categories = categoryDTOList.stream()
                .map(dto -> {
                    Category category = modelMapper.map(dto, Category.class);
                    category.setActive(true);
                    category.setCreatedAt(LocalDateTime.now());
                    category.setImage("default.png");
                    return category;
                })
                .toList();

        List<Category> savedCategories = categoryRepository.saveAll(categories);

        return savedCategories.stream()
                .map(category -> modelMapper.map(category, CategoryDTO.class))
                .toList();
    }



    @Override
    public CategoryDTO updateCategory(CategoryDTO categoryDTO, Long categoryId) {
        // Get the existing category form DB
        Category categoryFromDB = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category","categoryId",categoryId));
        // Update the category info with the one in request body
        categoryFromDB.setCategoryName(categoryDTO.getCategoryName());
        // Save to database
        Category saveCategory = categoryRepository.save(categoryFromDB);
        return modelMapper.map(saveCategory, CategoryDTO.class);
//        Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
//        if (categoryOptional.isPresent()){
//            Category savedCategory = categoryOptional.get();
//            savedCategory.setCategoryName(categoryDTO.getCategoryName());;
//            categoryRepository.save(savedCategory);
//            return modelMapper.map(savedCategory, CategoryDTO.class);
//        }else {
//            throw new ResourceNotFoundException("Category","categoryId",categoryId);
//        }
    }
}
