package com.ecommerce.project.service;

import com.ecommerce.project.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class SkuGeneratorService {

    private final ProductRepository productRepository;

    public SkuGeneratorService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }


    private String safePrefix(String value, int length) {
        if (value == null || value.isBlank()) {
            return "XX"; // fallback
        }

        String cleaned = value.replaceAll("\\s+", "").toUpperCase();
        return cleaned.substring(0, Math.min(length, cleaned.length()));
    }

    public String generateSku(String categoryName, String brand, String productName) {

        String cat = safePrefix(categoryName, 2);
        String br  = safePrefix(brand, 3);
        String prod = safePrefix(productName, 4);

        String random = String.valueOf((int) (Math.random() * 9000) + 1000);

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


