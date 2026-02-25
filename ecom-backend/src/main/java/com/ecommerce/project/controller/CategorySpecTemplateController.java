package com.ecommerce.project.controller;

import com.ecommerce.project.payload.SpecTemplateDTO;
import com.ecommerce.project.service.CategorySpecTemplateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CategorySpecTemplateController {

    private final CategorySpecTemplateService specTemplateService;

    public CategorySpecTemplateController(CategorySpecTemplateService specTemplateService) {
        this.specTemplateService = specTemplateService;
    }

    /**
     * PUBLIC: Get spec template fields for a category (used by seller form + PDP)
     */
    @GetMapping("/public/categories/{categoryId}/spec-template")
    public ResponseEntity<List<SpecTemplateDTO>> getSpecTemplate(@PathVariable Long categoryId) {
        List<SpecTemplateDTO> templates = specTemplateService.getSpecTemplateByCategory(categoryId);
        return ResponseEntity.ok(templates);
    }

    /**
     * ADMIN: Add a spec template to a category
     */
    @PostMapping("/admin/categories/{categoryId}/spec-template")
    public ResponseEntity<SpecTemplateDTO> addSpecTemplate(
            @PathVariable Long categoryId,
            @RequestBody SpecTemplateDTO dto) {
        SpecTemplateDTO saved = specTemplateService.addSpecTemplate(categoryId, dto);
        return ResponseEntity.ok(saved);
    }

    /**
     * ADMIN: Delete a spec template
     */
    @DeleteMapping("/admin/spec-template/{templateId}")
    public ResponseEntity<String> deleteSpecTemplate(@PathVariable Long templateId) {
        specTemplateService.deleteSpecTemplate(templateId);
        return ResponseEntity.ok("Spec template deleted");
    }
}
