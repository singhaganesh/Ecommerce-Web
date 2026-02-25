package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantDTO {

    private Long variantId;
    private Map<String, String> attributes;
    private double price;
    private double discount;
    private double specialPrice;
    private Integer quantity;
    private String sku;
    private String primaryImage;
}
