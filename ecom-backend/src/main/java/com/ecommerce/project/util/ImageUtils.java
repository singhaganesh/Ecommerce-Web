package com.ecommerce.project.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ImageUtils {

    @Value("${image.base.url}")
    private String imageBaseUrl;

    public String constructImageUrl(String imageUrl) {
        return imageBaseUrl.endsWith("/")
                ? imageBaseUrl + imageUrl
                : imageBaseUrl + "/" + imageUrl;
    }
}

