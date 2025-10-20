package com.example.howrunofspringboot.controller;

import com.example.howrunofspringboot.service.UserService;
import jakarta.annotation.PostConstruct;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Mine
 * @version 1.0
 * 描述:
 * @date 2025/10/17 22:34
 */
@RestController
public class UserController {

    private final UserService userService;

    // 依赖注入完成后执行
    public UserController(UserService userService) {
        System.out.println("4. 控制器层: UserController 初始化");
        this.userService = userService;
    }

    @PostConstruct
    public void init() {
        System.out.println("5. 控制器层: UserController @PostConstruct 执行");
    }
}