package com.ecommerce.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
@ToString
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long productId;
    @NotBlank(message = "Product name must not be empty")
    private String productName;
    private String image;
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


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User user;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<CartItem> cartItems;

}
