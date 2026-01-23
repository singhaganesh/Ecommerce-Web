package com.ecommerce.project.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private Long productId;

    private String sku;

    @NotBlank(message = "Product name must not be empty")
    private String productName;

    private List<String> images;
    private String primaryImage;
    private String brand;

    @NotBlank(message = "Product description must not be empty")
    @Size(min = 6, message = "Product description must contain at least 6 characters")
    private String description;

    private Integer quantity;
    private double price;
    private double discount;
    private double specialPrice;

    private Double rating;
    private Integer totalReviews;

    private Boolean featured;
    private Boolean active;

    private Integer soldCount;
    private boolean bestSeller;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 🔹 Required for category mapping (MICRO category only)
//    private Long categoryId;
}
