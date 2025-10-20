package com.howrunspringbootdemo.config;

/**
 * @author Mine
 * @version 1.0
 * 描述:
 * @date 2025/10/17 23:20
 */

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    // 可以添加其他全局配置Bean
}
