package com.example.Lightify.SecurityConfig;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                new AntPathRequestMatcher("/api/**"),
                                new AntPathRequestMatcher("/api/auth/register"),
                                new AntPathRequestMatcher("/api/auth/login"),
                                new AntPathRequestMatcher("/api/rooms/**"),
                                new AntPathRequestMatcher("/mqtt/**"),
                                new AntPathRequestMatcher("/mqtt/publish/**"),
                                new AntPathRequestMatcher("/api/topics/**")
                        ).permitAll()  // Allow public access to these paths
                        .anyRequest().authenticated()  // Other endpoints require authentication
                )
                .csrf(AbstractHttpConfigurer::disable);  // Disable CSRF for simplicity during testing

        return http.build();
    }
}
