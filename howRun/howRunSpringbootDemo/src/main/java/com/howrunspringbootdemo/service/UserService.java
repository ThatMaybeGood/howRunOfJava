package com.howrunspringbootdemo.service;

import com.howrunspringbootdemo.dto.UserDTO;
import com.howrunspringbootdemo.entity.User;

import java.util.List;

public interface UserService {

    User createUser(UserDTO userDTO);

    User getUserById(Long id);

    User getUserByUsername(String username);

    List<User> getAllUsers();

    User updateUser(Long id, UserDTO userDTO);

    void deleteUser(Long id);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}