package com.ecommerce.project.service;

import com.ecommerce.project.exception.ResourceNotFoundException;
import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.CategorySpecTemplate;
import com.ecommerce.project.payload.SpecTemplateDTO;
import com.ecommerce.project.repository.CategoryRepository;
import com.ecommerce.project.repository.CategorySpecTemplateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategorySpecTemplateService {

    private final CategorySpecTemplateRepository specTemplateRepository;
    private final CategoryRepository categoryRepository;

    public CategorySpecTemplateService(CategorySpecTemplateRepository specTemplateRepository,
            CategoryRepository categoryRepository) {
        this.specTemplateRepository = specTemplateRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<SpecTemplateDTO> getSpecTemplateByCategory(Long categoryId) {
        // Verify category exists
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

        List<CategorySpecTemplate> templates = specTemplateRepository
                .findByCategoryCategoryIdOrderByDisplayOrderAsc(categoryId);

        return templates.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public SpecTemplateDTO addSpecTemplate(Long categoryId, SpecTemplateDTO dto) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

        CategorySpecTemplate template = new CategorySpecTemplate();
        template.setCategory(category);
        template.setSpecKey(dto.getSpecKey());
        template.setSpecLabel(dto.getSpecLabel());
        template.setSpecGroup(dto.getSpecGroup());
        template.setSpecType(dto.getSpecType());
        template.setOptions(dto.getOptions());
        template.setRequired(dto.getRequired() != null ? dto.getRequired() : false);
        template.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
        template.setIsVariant(dto.getIsVariant() != null ? dto.getIsVariant() : false);

        CategorySpecTemplate saved = specTemplateRepository.save(template);
        return toDTO(saved);
    }

    @Transactional
    public void deleteSpecTemplate(Long templateId) {
        specTemplateRepository.deleteById(templateId);
    }

    private SpecTemplateDTO toDTO(CategorySpecTemplate entity) {
        SpecTemplateDTO dto = new SpecTemplateDTO();
        dto.setId(entity.getId());
        dto.setCategoryId(entity.getCategory().getCategoryId());
        dto.setSpecKey(entity.getSpecKey());
        dto.setSpecLabel(entity.getSpecLabel());
        dto.setSpecGroup(entity.getSpecGroup());
        dto.setSpecType(entity.getSpecType());
        dto.setOptions(entity.getOptions());
        dto.setRequired(entity.getRequired());
        dto.setDisplayOrder(entity.getDisplayOrder());
        dto.setIsVariant(entity.getIsVariant());
        return dto;
    }
}
