package com.ecommerce.project.payload;

import lombok.Data;

@Data
public class ProductRequest {

    private String productName;
    private String image;
    private String brand;
    private String description;

    private Integer quantity;
    private double price;
    private double discount;
    private double specialPrice;

    private Boolean featured;
    private Boolean active;

    private Long categoryId;   // MICRO category id only
}

