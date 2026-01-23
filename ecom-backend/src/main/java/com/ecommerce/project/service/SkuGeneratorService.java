package com.ecommerce.project.service;

import com.ecommerce.project.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class SkuGeneratorService {

    private final ProductRepository productRepository;

    public SkuGeneratorService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public String generateSku(String categoryName, String brand, String productName) {

        String cat = categoryName.replaceAll("\\s+", "").substring(0, 2).toUpperCase();
        String br = brand.replaceAll("\\s+", "").substring(0, 3).toUpperCase();
        String prod = productName.replaceAll("\\s+", "").substring(0, 4).toUpperCase();

        String random = String.valueOf((int)(Math.random() * 9000) + 1000);

        return cat + "-" + br + "-" + prod + "-" + random;
    }

    public String generateUniqueSku(String categoryName, String brand, String productName) {

        String sku;

        do {
            sku = generateSku(categoryName, brand, productName);
        } while (productRepository.existsBySku(sku));

        return sku;
    }

}

