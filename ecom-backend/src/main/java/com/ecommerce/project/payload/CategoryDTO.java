package com.ecommerce.project.payload;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private Long categoryId;

    @NotBlank(message = "Category name must not be empty")
    private String categoryName;
    private String image;
    private Boolean active;       // enable/disable category

    private Integer priority;     // display order on home page

    private LocalDateTime createdAt;

}
