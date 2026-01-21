package com.ecommerce.project.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;
    @NotBlank(message = "Category name must not be empty")
    private String productName;
    private String image;
    @NotBlank(message = "Category name must not be empty")
    @Size(min = 6, message = "Product description must contain atleast 6 character")
    private String description;
    private Integer quantity;
    private double price;
    private double discount;
    private double specialPrice;
    private Double rating;               // ⭐ 4.5
    private Integer totalReviews;        // 1250 reviews

    private Boolean featured;            // homepage featured
    private Boolean active;              // enable/disable product

    private Integer soldCount;           // analytics
    private boolean bestSeller;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
