package com.howrunspringbootdemo.controller;

/**
 * @author Mine
 * @version 1.0
 * 描述:
 * @date 2025/10/17 23:31
 */

import com.howrunspringbootdemo.dto.ApiResponse;
import com.howrunspringbootdemo.dto.UserDTO;
import com.howrunspringbootdemo.entity.User;
import com.howrunspringbootdemo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@Valid @RequestBody UserDTO userDTO) {
        try {
            User user = userService.createUser(userDTO);
            return ResponseEntity.ok(ApiResponse.success("注册成功", user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@RequestBody UserDTO userDTO) {
        try {
            User user = userService.getUserByUsername(userDTO.getUsername());
            // 简化版登录验证，实际应该使用密码加密和JWT等
            if (user.getPassword().equals(userDTO.getPassword())) {
                return ResponseEntity.ok(ApiResponse.success("登录成功", "mock-token"));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("密码错误"));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("用户名或密码错误"));
        }
    }
}