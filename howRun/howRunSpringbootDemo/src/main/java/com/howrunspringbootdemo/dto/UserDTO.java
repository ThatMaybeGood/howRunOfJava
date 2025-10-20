package com.howrunspringbootdemo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * @author Mine
 * @version 1.0
 * 描述:
 * @date 2025/10/17 23:27
 */
public class UserDTO {

    private Long id;

    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 50, message = "用户名长度必须在3-50个字符之间")
    private String username;

    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, message = "密码长度至少6个字符")
    private String password;

    // 构造函数
    public UserDTO() {}

    public UserDTO(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Getter 和 Setter 方法
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}