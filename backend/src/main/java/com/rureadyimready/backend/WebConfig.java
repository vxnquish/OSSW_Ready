package com.rureadyimready.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // 프론트엔드(.com) 도메인도 반드시 포함
                .allowedOrigins(
                        "https://rureadylovemap.com",
                        "https://www.rureadylovemap.com",
                        "https://rureadylovemap.kr",
                        "https://www.rureadylovemap.kr"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
