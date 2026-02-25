package com.ecommerce.project.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Map;

@Entity
@Table(name = "product_variants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "product")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long variantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    /**
     * Variant-defining attributes stored as JSONB.
     * Examples:
     * Phones: {"ram":"8GB", "storage":"128GB", "color":"Black"}
     * Shirts: {"size":"M", "color":"Navy"}
     * Shoes: {"size":"9", "color":"Black"}
     * Furniture: {"finish":"Walnut"}
     */
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private Map<String, String> attributes;

    @Column(nullable = false)
    private double price;

    private double discount;

    private double specialPrice;

    @Column(nullable = false)
    private Integer quantity;

    @Column(unique = true, nullable = false)
    private String sku;

    private String primaryImage; // variant-specific image (optional)
}
