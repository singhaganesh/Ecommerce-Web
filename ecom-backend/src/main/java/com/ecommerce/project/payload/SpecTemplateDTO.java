package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpecTemplateDTO {

    private Long id;
    private Long categoryId;
    private String specKey;
    private String specLabel;
    private String specGroup;
    private String specType; // TEXT, NUMBER, SELECT, SIZE_SELECTOR, COLOR_PICKER
    private List<String> options;
    private Boolean required;
    private Integer displayOrder;
    private Boolean isVariant;
}
