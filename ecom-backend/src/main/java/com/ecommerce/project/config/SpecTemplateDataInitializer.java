package com.ecommerce.project.config;

import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.CategorySpecTemplate;
import com.ecommerce.project.repository.CategoryRepository;
import com.ecommerce.project.repository.CategorySpecTemplateRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Seeds CategorySpecTemplate data for each MICRO category on first run.
 * Only inserts if no templates exist yet for a category.
 */
@Component
@Order(2) // run after any category seed
public class SpecTemplateDataInitializer implements CommandLineRunner {

        private final CategoryRepository categoryRepository;
        private final CategorySpecTemplateRepository specRepo;

        public SpecTemplateDataInitializer(CategoryRepository categoryRepository,
                        CategorySpecTemplateRepository specRepo) {
                this.categoryRepository = categoryRepository;
                this.specRepo = specRepo;
        }

        @Override
        @Transactional
        public void run(String... args) {
                // Find all leaf (micro) categories
                List<Category> allCategories = categoryRepository.findAll();

                for (Category cat : allCategories) {
                        // Only seed micro categories (those with no children)
                        if (cat.getChildren() != null && !cat.getChildren().isEmpty())
                                continue;

                        // Delete existing templates and re-seed to fix any mismatched data
                        if (specRepo.existsByCategoryCategoryId(cat.getCategoryId())) {
                                specRepo.deleteByCategoryCategoryId(cat.getCategoryId());
                        }

                        String name = cat.getCategoryName().toLowerCase().trim();
                        String rootType = cat.resolveCategoryType().toLowerCase().trim();

                        seedTemplatesFor(cat, name, rootType);
                }
        }

        private void seedTemplatesFor(Category cat, String name, String rootType) {
                // ═══════════════════════════════════════════════════
                // ELECTRONICS — check headphones BEFORE phones (since "headphones" contains
                // "phone")
                // ═══════════════════════════════════════════════════
                if (containsAny(name, "headphone", "earphone", "earbuds", "audio")) {
                        seedHeadphoneSpecs(cat);
                } else if (containsAny(name, "smartphone", "mobile") ||
                                (name.contains("phone") && !name.contains("headphone") && !name.contains("earphone"))) {
                        seedSmartphoneSpecs(cat);
                } else if (containsAny(name, "laptop", "notebook", "computer")) {
                        seedLaptopSpecs(cat);
                } else if (containsAny(name, "smartwatch", "watch", "wearable")) {
                        seedSmartwatchSpecs(cat);
                } else if (containsAny(name, "television", "tv", "monitor")) {
                        seedTVSpecs(cat);
                }

                // ═══════════════════════════════════════════════════
                // FASHION
                // ═══════════════════════════════════════════════════
                else if (containsAny(name, "shoe", "sneaker", "sandal", "footwear", "slipper")) {
                        seedShoeSpecs(cat);
                } else if (containsAny(name, "saree", "sari")) {
                        seedSareeSpecs(cat);
                } else if (containsAny(name, "shirt", "t-shirt", "tshirt", "top")) {
                        seedShirtSpecs(cat);
                } else if (containsAny(name, "jeans", "pant", "trouser", "bottom")) {
                        seedPantSpecs(cat);
                } else if (containsAny(name, "dress", "gown", "kurta", "kurti")) {
                        seedDressSpecs(cat);
                }

                // ═══════════════════════════════════════════════════
                // HOME & LIVING
                // ═══════════════════════════════════════════════════
                else if (containsAny(name, "furniture", "chair", "table", "sofa", "bed", "desk")) {
                        seedFurnitureSpecs(cat);
                } else if (containsAny(name, "kitchen", "cookware", "utensil")) {
                        seedKitchenSpecs(cat);
                } else if (containsAny(name, "decor", "decoration", "lamp", "light")) {
                        seedDecorSpecs(cat);
                }

                // ═══════════════════════════════════════════════════
                // SPORTS & FITNESS
                // ═══════════════════════════════════════════════════
                else if (containsAny(name, "gym", "fitness", "equipment", "dumbbell", "weight")) {
                        seedGymSpecs(cat);
                } else if (containsAny(name, "cricket", "bat", "ball")) {
                        seedCricketSpecs(cat);
                } else if (containsAny(name, "cycle", "bicycle", "bike")) {
                        seedCycleSpecs(cat);
                }

                // ═══════════════════════════════════════════════════
                // FALLBACK: Generic specs based on root category
                // ═══════════════════════════════════════════════════
                else if (rootType.contains("electronic")) {
                        seedGenericElectronicsSpecs(cat);
                } else if (rootType.contains("fashion")) {
                        seedGenericFashionSpecs(cat);
                } else if (rootType.contains("home")) {
                        seedGenericHomeSpecs(cat);
                } else if (rootType.contains("sport")) {
                        seedGenericSportsSpecs(cat);
                }
        }

        // ─── SMARTPHONES ──────────────────────────────────────
        private void seedSmartphoneSpecs(Category cat) {
                save(cat, "ram", "RAM", "Performance", "SELECT",
                                List.of("2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"),
                                true, 1, true);
                save(cat, "storage", "Internal Storage", "Performance", "SELECT",
                                List.of("16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"), true, 2, true);
                save(cat, "processor", "Processor", "Performance", "TEXT", null, false, 3, false);
                save(cat, "display_size", "Display Size", "Display", "TEXT", null, false, 4, false);
                save(cat, "display_type", "Display Type", "Display", "SELECT",
                                List.of("AMOLED", "Super AMOLED", "IPS LCD", "OLED", "Mini LED"), false, 5, false);
                save(cat, "rear_camera", "Rear Camera", "Camera", "TEXT", null, false, 6, false);
                save(cat, "front_camera", "Front Camera", "Camera", "TEXT", null, false, 7, false);
                save(cat, "battery", "Battery (mAh)", "Battery", "TEXT", null, false, 8, false);
                save(cat, "os", "Operating System", "General", "SELECT",
                                List.of("Android 14", "Android 13", "iOS 17", "iOS 16", "HarmonyOS"), false, 9, false);
                save(cat, "color", "Color", "General", "COLOR_PICKER",
                                List.of("Black", "White", "Blue", "Silver", "Gold", "Green", "Red", "Purple"), true, 10,
                                true);
                save(cat, "warranty", "Warranty", "General", "SELECT", List.of("1 Year", "2 Years", "No Warranty"),
                                false, 11,
                                false);
        }

        // ─── HEADPHONES ───────────────────────────────────────
        private void seedHeadphoneSpecs(Category cat) {
                save(cat, "driver_size", "Driver Size", "Technical", "TEXT", null, false, 1, false);
                save(cat, "impedance", "Impedance (Ω)", "Technical", "TEXT", null, false, 2, false);
                save(cat, "frequency_response", "Frequency Response", "Technical", "TEXT", null, false, 3, false);
                save(cat, "connectivity", "Connectivity", "General", "SELECT",
                                List.of("Bluetooth 5.0", "Bluetooth 5.3", "Wired (3.5mm)", "Wired (USB-C)",
                                                "Bluetooth + Wired"),
                                true,
                                4, false);
                save(cat, "noise_cancellation", "Noise Cancellation", "Features", "SELECT",
                                List.of("Active (ANC)", "Passive", "None"), false, 5, false);
                save(cat, "battery_life", "Battery Life (hours)", "Battery", "TEXT", null, false, 6, false);
                save(cat, "microphone", "Microphone", "Features", "SELECT", List.of("Built-in", "Detachable", "None"),
                                false, 7,
                                false);
                save(cat, "color", "Color", "General", "COLOR_PICKER",
                                List.of("Black", "White", "Blue", "Red", "Green"), true,
                                8, true);
                save(cat, "warranty", "Warranty", "General", "SELECT", List.of("1 Year", "2 Years", "No Warranty"),
                                false, 9,
                                false);
        }

        // ─── LAPTOPS ──────────────────────────────────────────
        private void seedLaptopSpecs(Category cat) {
                save(cat, "processor", "Processor", "Performance", "TEXT", null, true, 1, false);
                save(cat, "ram", "RAM", "Performance", "SELECT", List.of("4GB", "8GB", "16GB", "32GB", "64GB"), true, 2,
                                false);
                save(cat, "storage", "Storage", "Performance", "SELECT",
                                List.of("256GB SSD", "512GB SSD", "1TB SSD", "1TB HDD", "2TB HDD"), true, 3, false);
                save(cat, "display_size", "Display Size", "Display", "SELECT",
                                List.of("13.3\"", "14\"", "15.6\"", "16\"", "17.3\""), false, 4, false);
                save(cat, "gpu", "Graphics Card", "Performance", "TEXT", null, false, 5, false);
                save(cat, "os", "Operating System", "General", "SELECT",
                                List.of("Windows 11", "macOS", "Linux", "ChromeOS"),
                                false, 6, false);
                save(cat, "battery", "Battery Life (hours)", "Battery", "TEXT", null, false, 7, false);
                save(cat, "weight", "Weight (kg)", "General", "TEXT", null, false, 8, false);
                save(cat, "color", "Color", "General", "COLOR_PICKER", List.of("Silver", "Space Grey", "Black", "Blue"),
                                true,
                                9, true);
                save(cat, "warranty", "Warranty", "General", "SELECT", List.of("1 Year", "2 Years", "3 Years"), false,
                                10,
                                false);
        }

        // ─── SMARTWATCH ───────────────────────────────────────
        private void seedSmartwatchSpecs(Category cat) {
                save(cat, "display_size", "Display Size", "Display", "TEXT", null, false, 1, false);
                save(cat, "display_type", "Display Type", "Display", "SELECT", List.of("AMOLED", "LCD", "LED"), false,
                                2,
                                false);
                save(cat, "battery_life", "Battery Life (days)", "Battery", "TEXT", null, false, 3, false);
                save(cat, "water_resistance", "Water Resistance", "Features", "SELECT",
                                List.of("IP67", "IP68", "5ATM", "None"),
                                false, 4, false);
                save(cat, "connectivity", "Connectivity", "General", "SELECT",
                                List.of("Bluetooth", "Bluetooth + WiFi", "Bluetooth + WiFi + LTE"), false, 5, false);
                save(cat, "sensors", "Sensors", "Features", "TEXT", null, false, 6, false);
                save(cat, "strap_material", "Strap Material", "General", "SELECT",
                                List.of("Silicone", "Leather", "Metal", "Nylon"), false, 7, false);
                save(cat, "color", "Color", "General", "COLOR_PICKER",
                                List.of("Black", "Silver", "Gold", "Rose Gold", "Green"),
                                true, 8, true);
                save(cat, "warranty", "Warranty", "General", "SELECT", List.of("1 Year", "2 Years"), false, 9, false);
        }

        // ─── TV / MONITOR ─────────────────────────────────────
        private void seedTVSpecs(Category cat) {
                save(cat, "screen_size", "Screen Size", "Display", "SELECT",
                                List.of("32\"", "40\"", "43\"", "50\"", "55\"", "65\"", "75\"", "85\""), true, 1,
                                false);
                save(cat, "resolution", "Resolution", "Display", "SELECT",
                                List.of("HD (720p)", "Full HD (1080p)", "4K UHD", "8K UHD"), true, 2, false);
                save(cat, "display_type", "Display Type", "Display", "SELECT",
                                List.of("LED", "OLED", "QLED", "Mini LED", "NanoCell"), false, 3, false);
                save(cat, "smart_tv", "Smart TV", "Features", "SELECT",
                                List.of("Android TV", "Google TV", "webOS", "Tizen", "Fire TV", "Non-Smart"), false, 4,
                                false);
                save(cat, "refresh_rate", "Refresh Rate", "Display", "SELECT", List.of("60Hz", "120Hz", "144Hz"), false,
                                5,
                                false);
                save(cat, "speakers", "Speaker Output", "Audio", "TEXT", null, false, 6, false);
                save(cat, "warranty", "Warranty", "General", "SELECT", List.of("1 Year", "2 Years", "3 Years"), false,
                                7,
                                false);
        }

        // ─── SHOES ────────────────────────────────────────────
        private void seedShoeSpecs(Category cat) {
                save(cat, "size", "Size (UK)", "Sizing", "SIZE_SELECTOR",
                                List.of("3", "4", "5", "6", "7", "8", "9", "10", "11", "12"), true, 1, true);
                save(cat, "upper_material", "Upper Material", "Material", "SELECT",
                                List.of("Leather", "Canvas", "Mesh", "Synthetic", "Knit", "Suede"), false, 2, false);
                save(cat, "sole_material", "Sole Material", "Material", "SELECT",
                                List.of("Rubber", "EVA", "PU", "TPR", "Phylon"), false, 3, false);
                save(cat, "closure_type", "Closure Type", "Design", "SELECT",
                                List.of("Lace-Up", "Slip-On", "Velcro", "Buckle", "Zip"), false, 4, false);
                save(cat, "occasion", "Occasion", "General", "SELECT", List.of("Casual", "Sports", "Formal", "Party"),
                                false, 5,
                                false);
                save(cat, "color", "Color", "General", "COLOR_PICKER",
                                List.of("Black", "White", "Brown", "Blue", "Red", "Grey", "Multi"), true, 6, true);
                save(cat, "warranty", "Warranty", "General", "SELECT",
                                List.of("3 Months", "6 Months", "1 Year", "No Warranty"),
                                false, 7, false);
        }

        // ─── SAREES ───────────────────────────────────────────
        private void seedSareeSpecs(Category cat) {
                save(cat, "fabric", "Fabric", "Material", "SELECT",
                                List.of("Silk", "Cotton", "Georgette", "Chiffon", "Crepe", "Linen", "Net", "Banarasi"),
                                true, 1, false);
                save(cat, "length", "Length (meters)", "Dimensions", "SELECT", List.of("5.5m", "6m", "6.3m", "6.5m"),
                                false, 2,
                                false);
                save(cat, "width", "Width (inches)", "Dimensions", "TEXT", null, false, 3, false);
                save(cat, "blouse_piece", "Blouse Piece", "Includes", "SELECT",
                                List.of("Included (Unstitched)", "Included (Stitched)", "Not Included"), true, 4,
                                false);
                save(cat, "pattern", "Pattern", "Design", "SELECT",
                                List.of("Solid", "Printed", "Woven", "Embroidered", "Block Print", "Bandhani"), false,
                                5, false);
                save(cat, "occasion", "Occasion", "General", "SELECT",
                                List.of("Casual", "Festive", "Wedding", "Party", "Daily Wear"), false, 6, false);
                save(cat, "color", "Color", "General", "COLOR_PICKER",
                                List.of("Red", "Blue", "Green", "Yellow", "Pink", "Black", "White", "Gold", "Maroon"),
                                true, 7, true);
                save(cat, "wash_care", "Wash Care", "Care", "SELECT",
                                List.of("Hand Wash", "Dry Clean Only", "Machine Washable"), false, 8, false);
        }

        // ─── SHIRTS/T-SHIRTS ──────────────────────────────────
        private void seedShirtSpecs(Category cat) {
                save(cat, "size", "Size", "Sizing", "SIZE_SELECTOR", List.of("XS", "S", "M", "L", "XL", "XXL", "3XL"),
                                true, 1,
                                true);
                save(cat, "fabric", "Fabric", "Material", "SELECT",
                                List.of("Cotton", "Polyester", "Linen", "Silk", "Rayon", "Denim", "Cotton Blend"), true,
                                2, false);
                save(cat, "fit_type", "Fit Type", "Design", "SELECT",
                                List.of("Regular Fit", "Slim Fit", "Oversized", "Relaxed Fit"), false, 3, false);
                save(cat, "sleeve", "Sleeve", "Design", "SELECT",
                                List.of("Full Sleeve", "Half Sleeve", "Sleeveless", "3/4 Sleeve"), false, 4, false);
                save(cat, "pattern", "Pattern", "Design", "SELECT",
                                List.of("Solid", "Striped", "Checked", "Printed", "Abstract"), false, 5, false);
                save(cat, "collar", "Collar Type", "Design", "SELECT",
                                List.of("Regular", "Mandarin", "Spread", "Button-Down", "Round Neck", "V-Neck", "Polo"),
                                false, 6,
                                false);
                save(cat, "occasion", "Occasion", "General", "SELECT", List.of("Casual", "Formal", "Party", "Sports"),
                                false, 7,
                                false);
                save(cat, "color", "Color", "General", "COLOR_PICKER",
                                List.of("Black", "White", "Blue", "Red", "Green", "Navy", "Grey", "Pink"), true, 8,
                                true);
        }

        // ─── PANTS/JEANS ──────────────────────────────────────
        private void seedPantSpecs(Category cat) {
                save(cat, "waist_size", "Waist Size", "Sizing", "SIZE_SELECTOR",
                                List.of("28", "30", "32", "34", "36", "38", "40", "42"), true, 1, true);
                save(cat, "length", "Length", "Sizing", "SELECT", List.of("Regular", "Short", "Long"), false, 2, false);
                save(cat, "fabric", "Fabric", "Material", "SELECT",
                                List.of("Denim", "Cotton", "Polyester", "Chinos", "Corduroy", "Linen"), true, 3, false);
                save(cat, "fit_type", "Fit Type", "Design", "SELECT",
                                List.of("Slim Fit", "Regular Fit", "Straight Fit", "Skinny", "Bootcut", "Tapered"),
                                false, 4, false);
                save(cat, "rise", "Rise", "Design", "SELECT", List.of("Low Rise", "Mid Rise", "High Rise"), false, 5,
                                false);
                save(cat, "color", "Color", "General", "COLOR_PICKER",
                                List.of("Blue", "Black", "Grey", "Khaki", "White", "Navy"), true, 6, true);
        }

        // ─── DRESSES/KURTAS ───────────────────────────────────
        private void seedDressSpecs(Category cat) {
                save(cat, "size", "Size", "Sizing", "SIZE_SELECTOR", List.of("XS", "S", "M", "L", "XL", "XXL"), true, 1,
                                true);
                save(cat, "fabric", "Fabric", "Material", "SELECT",
                                List.of("Cotton", "Rayon", "Silk", "Georgette", "Crepe", "Chiffon", "Linen"), true, 2,
                                false);
                save(cat, "length", "Length", "Design", "SELECT",
                                List.of("Mini", "Midi", "Maxi", "Knee Length", "Ankle Length"), false, 3, false);
                save(cat, "sleeve", "Sleeve", "Design", "SELECT",
                                List.of("Full Sleeve", "Half Sleeve", "Sleeveless", "3/4 Sleeve"), false, 4, false);
                save(cat, "pattern", "Pattern", "Design", "SELECT",
                                List.of("Solid", "Printed", "Embroidered", "Floral"), false,
                                5, false);
                save(cat, "occasion", "Occasion", "General", "SELECT",
                                List.of("Casual", "Festive", "Wedding", "Party", "Office"), false, 6, false);
                save(cat, "color", "Color", "General", "COLOR_PICKER",
                                List.of("Black", "White", "Red", "Blue", "Green", "Pink", "Yellow"), true, 7, true);
        }

        // ─── FURNITURE ────────────────────────────────────────
        private void seedFurnitureSpecs(Category cat) {
                save(cat, "material", "Material", "Material", "SELECT",
                                List.of("Solid Wood", "Engineered Wood", "Metal", "Plastic", "Bamboo", "Rattan"), true,
                                1, false);
                save(cat, "dimensions", "Dimensions (L×W×H cm)", "Dimensions", "TEXT", null, true, 2, false);
                save(cat, "weight", "Weight (kg)", "Dimensions", "TEXT", null, false, 3, false);
                save(cat, "seating_capacity", "Seating Capacity", "Features", "SELECT",
                                List.of("1", "2", "3", "4", "5", "6+"),
                                false, 4, false);
                save(cat, "assembly", "Assembly Required", "General", "SELECT", List.of("Yes", "No", "Partial"), true,
                                5,
                                false);
                save(cat, "finish", "Finish", "Design", "SELECT",
                                List.of("Natural", "Walnut", "Oak", "Mahogany", "White", "Black", "Grey"), false, 6,
                                false);
                save(cat, "warranty", "Warranty", "General", "SELECT",
                                List.of("1 Year", "2 Years", "3 Years", "5 Years"),
                                false, 7, false);
        }

        // ─── KITCHEN ──────────────────────────────────────────
        private void seedKitchenSpecs(Category cat) {
                save(cat, "material", "Material", "Material", "SELECT",
                                List.of("Stainless Steel", "Non-Stick", "Cast Iron", "Aluminium", "Ceramic", "Glass"),
                                true, 1, false);
                save(cat, "capacity", "Capacity", "Dimensions", "TEXT", null, false, 2, false);
                save(cat, "compatible_heat", "Heat Source", "Features", "SELECT",
                                List.of("Gas", "Induction", "Electric", "All"), false, 3, false);
                save(cat, "dishwasher_safe", "Dishwasher Safe", "Care", "SELECT", List.of("Yes", "No"), false, 4,
                                false);
                save(cat, "color", "Color", "General", "COLOR_PICKER",
                                List.of("Silver", "Black", "Red", "Blue", "White"), true,
                                5, true);
                save(cat, "warranty", "Warranty", "General", "SELECT", List.of("1 Year", "2 Years", "5 Years"), false,
                                6,
                                false);
        }

        // ─── DECOR ────────────────────────────────────────────
        private void seedDecorSpecs(Category cat) {
                save(cat, "material", "Material", "Material", "SELECT",
                                List.of("Wood", "Metal", "Glass", "Ceramic", "Fabric", "Resin"), false, 1, false);
                save(cat, "dimensions", "Dimensions", "Dimensions", "TEXT", null, false, 2, false);
                save(cat, "style", "Style", "Design", "SELECT",
                                List.of("Modern", "Traditional", "Bohemian", "Minimalist", "Industrial", "Vintage"),
                                false, 3, false);
                save(cat, "room_type", "Room Type", "General", "SELECT",
                                List.of("Living Room", "Bedroom", "Kitchen", "Bathroom", "Outdoor"), false, 4, false);
                save(cat, "color", "Color", "General", "COLOR_PICKER",
                                List.of("Gold", "Silver", "Black", "White", "Multi"),
                                true, 5, true);
        }

        // ─── GYM EQUIPMENT ────────────────────────────────────
        private void seedGymSpecs(Category cat) {
                save(cat, "material", "Material", "Material", "SELECT",
                                List.of("Steel", "Iron", "Rubber", "PVC", "Neoprene"),
                                false, 1, false);
                save(cat, "weight", "Weight (kg)", "Specifications", "TEXT", null, false, 2, false);
                save(cat, "max_load", "Max Load Capacity (kg)", "Specifications", "TEXT", null, false, 3, false);
                save(cat, "dimensions", "Dimensions (L×W×H)", "Specifications", "TEXT", null, false, 4, false);
                save(cat, "adjustable", "Adjustable", "Features", "SELECT", List.of("Yes", "No"), false, 5, false);
                save(cat, "color", "Color", "General", "COLOR_PICKER", List.of("Black", "Red", "Blue", "Grey"), true, 6,
                                true);
                save(cat, "warranty", "Warranty", "General", "SELECT", List.of("6 Months", "1 Year", "2 Years"), false,
                                7,
                                false);
        }

        // ─── CRICKET ──────────────────────────────────────────
        private void seedCricketSpecs(Category cat) {
                save(cat, "material", "Material", "Material", "SELECT",
                                List.of("English Willow", "Kashmir Willow", "Leather", "Synthetic", "Rubber"), false, 1,
                                false);
                save(cat, "weight", "Weight (grams)", "Specifications", "TEXT", null, false, 2, false);
                save(cat, "size", "Size", "Sizing", "SIZE_SELECTOR",
                                List.of("Short Handle", "Long Handle", "Junior", "Youth"),
                                true, 3, true);
                save(cat, "skill_level", "Skill Level", "General", "SELECT",
                                List.of("Beginner", "Intermediate", "Professional"), false, 4, false);
        }

        // ─── CYCLES ───────────────────────────────────────────
        private void seedCycleSpecs(Category cat) {
                save(cat, "frame_material", "Frame Material", "Material", "SELECT",
                                List.of("Steel", "Aluminium", "Carbon Fiber", "Alloy"), true, 1, false);
                save(cat, "wheel_size", "Wheel Size", "Specifications", "SELECT",
                                List.of("20\"", "24\"", "26\"", "27.5\"", "29\""), true, 2, false);
                save(cat, "gears", "Gears", "Specifications", "SELECT",
                                List.of("Single Speed", "3 Speed", "7 Speed", "21 Speed", "24 Speed"), false, 3, false);
                save(cat, "brake_type", "Brake Type", "Specifications", "SELECT",
                                List.of("Disc Brake", "V-Brake", "Rim Brake", "Drum Brake"), false, 4, false);
                save(cat, "type", "Type", "General", "SELECT", List.of("Mountain", "Road", "Hybrid", "BMX", "Kids"),
                                false, 5,
                                false);
                save(cat, "color", "Color", "General", "COLOR_PICKER",
                                List.of("Black", "Red", "Blue", "White", "Green", "Orange"), true, 6, true);
        }

        // ─── GENERIC FALLBACKS ────────────────────────────────
        private void seedGenericElectronicsSpecs(Category cat) {
                save(cat, "brand_model", "Model Number", "General", "TEXT", null, false, 1, false);
                save(cat, "power", "Power Consumption", "Technical", "TEXT", null, false, 2, false);
                save(cat, "connectivity", "Connectivity", "Technical", "TEXT", null, false, 3, false);
                save(cat, "color", "Color", "General", "COLOR_PICKER", List.of("Black", "White", "Silver", "Blue"),
                                true, 4,
                                true);
                save(cat, "warranty", "Warranty", "General", "SELECT", List.of("1 Year", "2 Years", "No Warranty"),
                                false, 5,
                                false);
        }

        private void seedGenericFashionSpecs(Category cat) {
                save(cat, "size", "Size", "Sizing", "SIZE_SELECTOR", List.of("XS", "S", "M", "L", "XL", "XXL"), true, 1,
                                true);
                save(cat, "fabric", "Fabric", "Material", "SELECT",
                                List.of("Cotton", "Polyester", "Silk", "Linen", "Wool"),
                                false, 2, false);
                save(cat, "color", "Color", "General", "COLOR_PICKER",
                                List.of("Black", "White", "Blue", "Red", "Green"), true,
                                3, true);
                save(cat, "occasion", "Occasion", "General", "SELECT", List.of("Casual", "Formal", "Party", "Sports"),
                                false, 4,
                                false);
        }

        private void seedGenericHomeSpecs(Category cat) {
                save(cat, "material", "Material", "Material", "TEXT", null, false, 1, false);
                save(cat, "dimensions", "Dimensions", "Dimensions", "TEXT", null, false, 2, false);
                save(cat, "color", "Color", "General", "COLOR_PICKER", List.of("Black", "White", "Brown", "Grey"), true,
                                3,
                                true);
                save(cat, "warranty", "Warranty", "General", "SELECT", List.of("1 Year", "2 Years"), false, 4, false);
        }

        private void seedGenericSportsSpecs(Category cat) {
                save(cat, "material", "Material", "Material", "TEXT", null, false, 1, false);
                save(cat, "weight", "Weight", "Specifications", "TEXT", null, false, 2, false);
                save(cat, "color", "Color", "General", "COLOR_PICKER", List.of("Black", "Blue", "Red", "Green"), true,
                                3, true);
                save(cat, "skill_level", "Skill Level", "General", "SELECT",
                                List.of("Beginner", "Intermediate", "Professional"), false, 4, false);
        }

        // ─── HELPER ───────────────────────────────────────────
        private void save(Category cat, String key, String label, String group, String type,
                        List<String> options, boolean required, int order, boolean isVariant) {
                CategorySpecTemplate t = new CategorySpecTemplate();
                t.setCategory(cat);
                t.setSpecKey(key);
                t.setSpecLabel(label);
                t.setSpecGroup(group);
                t.setSpecType(type);
                t.setOptions(options);
                t.setRequired(required);
                t.setDisplayOrder(order);
                t.setIsVariant(isVariant);
                specRepo.save(t);
        }

        private boolean containsAny(String text, String... keywords) {
                for (String keyword : keywords) {
                        if (text.contains(keyword))
                                return true;
                }
                return false;
        }
}
