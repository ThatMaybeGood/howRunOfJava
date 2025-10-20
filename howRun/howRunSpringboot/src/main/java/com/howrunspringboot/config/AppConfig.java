package com.howrunspringboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.client.RestTemplate;

/**
 * @author Mine
 * @version 1.0
 * 描述:
 * @date 2025/10/17 23:11
 */
@Configuration
public class AppConfig {

    @Bean
    @Order(1)
    public RestTemplate restTemplate() {
        System.out.println("1. 配置类: 创建RestTemplate Bean");
        return new RestTemplate();
    }
}