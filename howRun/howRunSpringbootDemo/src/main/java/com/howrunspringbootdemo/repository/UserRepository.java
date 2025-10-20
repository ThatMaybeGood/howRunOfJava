package com.howrunspringbootdemo.repository;

import com.howrunspringbootdemo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * @author Mine
 * @version 1.0
 * 描述:
 * @date 2025/10/17 23:18
 */


@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}