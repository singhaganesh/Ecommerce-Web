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

        /* =========================
           MAIN CATEGORIES
        ========================== */
        Category electronics = createCategory("Electronics", null, 1);
        Category fashion = createCategory("Fashion", null, 2);
        Category home = createCategory("Home & Living", null, 3);
        Category sports = createCategory("Sports & Fitness", null, 4);


        /* =========================
           ELECTRONICS
        ========================== */
        Category mobile = createCategory("Mobile Phones", electronics, null);
        Category laptops = createCategory("Laptops & Computers", electronics, null);
        Category audio = createCategory("Audio", electronics, null);
        Category smart = createCategory("Smart Devices", electronics, null);
        Category accessories = createCategory("Accessories", electronics, null);

        // Mobile
        createCategory("Android Phones", mobile, null);
        createCategory("iPhones", mobile, null);
        createCategory("Feature Phones", mobile, null);

        // Laptops
        createCategory("Gaming Laptops", laptops, null);
        createCategory("Business Laptops", laptops, null);
        createCategory("Student Laptops", laptops, null);
        createCategory("Desktop PCs", laptops, null);

        // Audio
        createCategory("Headphones", audio, null);
        createCategory("Earbuds", audio, null);
        createCategory("Bluetooth Speakers", audio, null);
        createCategory("Soundbars", audio, null);

        // Smart Devices
        createCategory("Smart Watches", smart, null);
        createCategory("Smart Bands", smart, null);
        createCategory("Smart Home Devices", smart, null);
        createCategory("Smart Cameras", smart, null);

        // Accessories
        createCategory("Chargers", accessories, null);
        createCategory("Power Banks", accessories, null);
        createCategory("Phone Cases", accessories, null);
        createCategory("Cables", accessories, null);


        /* =========================
           FASHION
        ========================== */
        Category men = createCategory("Men", fashion, null);
        Category women = createCategory("Women", fashion, null);
        Category kids = createCategory("Kids", fashion, null);
        Category fashionAccessories = createCategory("Fashion Accessories", fashion, null);

        // Men
        createCategory("Shirts", men, null);
        createCategory("T-Shirts", men, null);
        createCategory("Jeans", men, null);
        createCategory("Shoes", men, null);

        // Women
        createCategory("Dresses", women, null);
        createCategory("Sarees", women, null);
        createCategory("Tops", women, null);
        createCategory("Handbags", women, null);

        // Kids
        createCategory("Boys Clothing", kids, null);
        createCategory("Girls Clothing", kids, null);
        createCategory("Kids Shoes", kids, null);
        createCategory("School Wear", kids, null);

        // Fashion Accessories
        createCategory("Watches", fashionAccessories, null);
        createCategory("Sunglasses", fashionAccessories, null);
        createCategory("Wallets", fashionAccessories, null);
        createCategory("Belts", fashionAccessories, null);


        /* =========================
           HOME & LIVING
        ========================== */
        Category furniture = createCategory("Furniture", home, null);
        Category kitchen = createCategory("Kitchen", home, null);
        Category decor = createCategory("Home Decor", home, null);
        Category appliances = createCategory("Appliances", home, null);

        // Furniture
        createCategory("Sofas", furniture, null);
        createCategory("Beds", furniture, null);
        createCategory("Tables", furniture, null);
        createCategory("Chairs", furniture, null);

        // Kitchen
        createCategory("Cookware", kitchen, null);
        createCategory("Dinner Sets", kitchen, null);
        createCategory("Kitchen Tools", kitchen, null);
        createCategory("Storage Containers", kitchen, null);

        // Decor
        createCategory("Wall Art", decor, null);
        createCategory("Lamps", decor, null);
        createCategory("Curtains", decor, null);
        createCategory("Showpieces", decor, null);

        // Appliances
        createCategory("Mixer Grinders", appliances, null);
        createCategory("Microwave Ovens", appliances, null);
        createCategory("Refrigerators", appliances, null);
        createCategory("Washing Machines", appliances, null);


        /* =========================
           SPORTS & FITNESS
        ========================== */
        Category cricket = createCategory("Cricket", sports, null);
        Category football = createCategory("Football", sports, null);
        Category gym = createCategory("Gym Equipment", sports, null);
        Category yoga = createCategory("Yoga & Wellness", sports, null);

        // Cricket
        createCategory("Bats", cricket, null);
        createCategory("Balls", cricket, null);
        createCategory("Gloves", cricket, null);
        createCategory("Cricket Kits", cricket, null);

        // Football
        createCategory("Footballs", football, null);
        createCategory("Jerseys", football, null);
        createCategory("Football Shoes", football, null);
        createCategory("Goalkeeper Gloves", football, null);

        // Gym
        createCategory("Dumbbells", gym, null);
        createCategory("Resistance Bands", gym, null);
        createCategory("Treadmills", gym, null);
        createCategory("Exercise Cycles", gym, null);

        // Yoga
        createCategory("Yoga Mats", yoga, null);
        createCategory("Foam Rollers", yoga, null);
        createCategory("Skipping Ropes", yoga, null);
        createCategory("Fitness Trackers", yoga, null);
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
