package com.howrunspringbootdemo.controller;

/**
 * @author Mine
 * @version 1.0
 * 描述:
 * @date 2025/10/17 23:16
 */

import com.howrunspringbootdemo.dto.ApiResponse;
import com.howrunspringbootdemo.dto.UserDTO;
import com.howrunspringbootdemo.entity.User;
import com.howrunspringbootdemo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<User>> createUser(@Valid @RequestBody UserDTO userDTO) {
        try {
            User user = userService.createUser(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("用户创建成功", user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(ApiResponse.success("查询成功", user));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("查询成功", users));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO userDTO) {
        try {
            User user = userService.updateUser(id, userDTO);
            return ResponseEntity.ok(ApiResponse.success("用户更新成功", user));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(ApiResponse.success("用户删除成功"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}