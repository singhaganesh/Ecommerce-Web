package com.ecommerce.project;

import com.ecommerce.project.model.AppRole;
import com.ecommerce.project.model.Role;
import com.ecommerce.project.model.User;
import com.ecommerce.project.repository.RoleRepository;
import com.ecommerce.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Order(2)   // runs AFTER category loader
public class UserDataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_USER)));

        Role sellerRole = roleRepository.findByRoleName(AppRole.ROLE_SELLER)
                .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_SELLER)));

        Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_ADMIN)));

        createUserIfNotExists("user1", "user1@example.com", "password1", Set.of(userRole));
        createUserIfNotExists("seller1", "seller1@example.com", "password2", Set.of(sellerRole));
        createUserIfNotExists("admin", "admin@example.com", "adminPass",
                Set.of(userRole, sellerRole, adminRole));
    }

    private void createUserIfNotExists(String username, String email, String password, Set<Role> roles) {

        if (userRepository.existsByUserName(username)) return;

        User user = new User(username, email, passwordEncoder.encode(password));

        // IMPORTANT: modify roles safely
        user.getRoles().addAll(roles);

        userRepository.save(user);
    }
}

