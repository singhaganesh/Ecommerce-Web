package com.ecommerce.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "products")
@ToString(exclude = {"images", "category", "user", "cartItems"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long productId;

    @Column(unique = true, nullable = false)
    private String sku;

    @NotBlank(message = "Product name must not be empty")
    private String productName;

    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ProductImage> images;
    private String brand;                // Apple, Samsung, Nike etc

    @Column(length = 1000)
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

    // 🔹 Product belongs to MICRO category only
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    // 🔹 Seller
    @JoinColumn(name = "seller_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    // 🔹 Cart Mapping
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<CartItem> cartItems;
}
