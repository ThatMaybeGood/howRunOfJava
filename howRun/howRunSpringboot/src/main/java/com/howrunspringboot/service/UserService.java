package com.howrunspringboot.service;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

/**
 * @author Mine
 * @version 1.0
 * 描述:
 * @date 2025/10/17 23:12
 */
@Service
public class UserService {

    public UserService() {
        System.out.println("2. 服务层: UserService 初始化");
    }

    @PostConstruct
    public void init() {
        System.out.println("3. 服务层: UserService @PostConstruct 执行");
    }
}