package com.ecommerce.project.config;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Value("${image.base.url}")
    private String imageBaseUrl;

    @Bean
    public ModelMapper modelMapper(){
        return new ModelMapper();
    }

    public String constructImageUrl(String imageUrl) {
        return imageBaseUrl.endsWith("/") ? imageBaseUrl + imageUrl : imageBaseUrl + "/" + imageUrl;
    }
}
