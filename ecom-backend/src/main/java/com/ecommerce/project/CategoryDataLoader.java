package com.ecommerce.project;

import com.ecommerce.project.model.Category;
import com.ecommerce.project.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Order(1)
public class CategoryDataLoader implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {

        // Main Categories
        Category electronics = createCategory("Electronics", null, 1);
        Category fashion = createCategory("Fashion", null, 2);
        Category sports = createCategory("Sports & Fitness", null, 3);
        Category home = createCategory("Home & Kitchen", null, 4);

        // Electronics Sub Categories
        Category mobile = createCategory("Mobile Phones", electronics, null);
        Category laptops = createCategory("Laptops", electronics, null);
        Category accessories = createCategory("Accessories", electronics, null);
        Category smart = createCategory("Smart Devices", electronics, null);

        createCategory("Android Phones", mobile, null);
        createCategory("iPhones", mobile, null);
        createCategory("Feature Phones", mobile, null);

        createCategory("Gaming Laptops", laptops, null);
        createCategory("Business Laptops", laptops, null);
        createCategory("Student Laptops", laptops, null);

        createCategory("Headphones", accessories, null);
        createCategory("Power Banks", accessories, null);
        createCategory("Chargers", accessories, null);

        createCategory("Smart Watches", smart, null);
        createCategory("Smart Bands", smart, null);
        createCategory("Smart Home", smart, null);

        // Fashion
        Category men = createCategory("Men", fashion, null);
        Category women = createCategory("Women", fashion, null);
        Category kids = createCategory("Kids", fashion, null);

        createCategory("Shirts", men, null);
        createCategory("T-Shirts", men, null);
        createCategory("Jeans", men, null);
        createCategory("Shoes", men, null);

        createCategory("Dresses", women, null);
        createCategory("Sarees", women, null);
        createCategory("Tops", women, null);
        createCategory("Handbags", women, null);

        createCategory("Boys Clothing", kids, null);
        createCategory("Girls Clothing", kids, null);
        createCategory("Kids Shoes", kids, null);

        // Sports
        Category cricket = createCategory("Cricket", sports, null);
        Category football = createCategory("Football", sports, null);
        Category gym = createCategory("Gym & Yoga", sports, null);

        createCategory("Bats", cricket, null);
        createCategory("Balls", cricket, null);
        createCategory("Kits", cricket, null);
        createCategory("Gloves", cricket, null);

        createCategory("Football", football, null);
        createCategory("Shoes", football, null);
        createCategory("Jerseys", football, null);
        createCategory("Gloves (Football)", football, null);

        createCategory("Dumbbells", gym, null);
        createCategory("Yoga Mats", gym, null);
        createCategory("Resistance Bands", gym, null);
        createCategory("Gym Accessories", gym, null);

        // Home & Kitchen
        Category furniture = createCategory("Furniture", home, null);
        Category kitchen = createCategory("Kitchen", home, null);
        Category decor = createCategory("Home Decor", home, null);

        createCategory("Sofa", furniture, null);
        createCategory("Beds", furniture, null);
        createCategory("Tables", furniture, null);
        createCategory("Chairs", furniture, null);

        createCategory("Cookware", kitchen, null);
        createCategory("Dinner Sets", kitchen, null);
        createCategory("Storage", kitchen, null);
        createCategory("Kitchen Tools", kitchen, null);

        createCategory("Wall Art", decor, null);
        createCategory("Lamps", decor, null);
        createCategory("Curtains", decor, null);
        createCategory("Showpieces", decor, null);
    }

    private Category createCategory(String name, Category parent, Integer priority) {
        return categoryRepository.findByCategoryName(name).orElseGet(() -> {
            Category category = new Category();
            category.setCategoryName(name);
            category.setParent(parent);
            category.setActive(true);
            category.setPriority(priority);
            category.setCreatedAt(LocalDateTime.now());
            return categoryRepository.save(category);
        });
    }
}

