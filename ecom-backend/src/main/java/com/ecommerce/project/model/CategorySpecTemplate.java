package com.ecommerce.project.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "category_spec_templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategorySpecTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Links to a MICRO category
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private String specKey; // e.g. "ram", "storage", "sole_material"

    @Column(nullable = false)
    private String specLabel; // e.g. "RAM", "Storage", "Sole Material"

    private String specGroup; // e.g. "Performance", "General", "Material"

    @Column(nullable = false)
    private String specType; // TEXT, NUMBER, SELECT, SIZE_SELECTOR, COLOR_PICKER

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> options; // e.g. ["4GB","6GB","8GB"] for SELECT type

    @Column(nullable = false)
    private Boolean required = false;

    private Integer displayOrder = 0;

    @Column(nullable = false)
    private Boolean isVariant = false; // true = buyer-selectable (size, color)
}
