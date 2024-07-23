package com.ti.matriculas.security;

import com.ti.matriculas.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    private AlumnoDetailsService userDetailsService;

    @Autowired
    public WebSecurityConfig(AlumnoDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf((csrf) -> csrf.disable())
                //Todas requieren autentificacion menos "/"
                .authorizeHttpRequests((requests) -> requests
//                                .requestMatchers("/dashboard", "/historial",
//                                        "/matriculables", "/matriculados")
                                .anyRequest()
                                .authenticated()
                )
                .httpBasic(withDefaults())
                .formLogin((form) -> form
                                .loginPage("/")   //Nuestro login es URL base, no tenemos home
                                .defaultSuccessUrl("/dashboard", true)
                                .permitAll()
                )
                .logout((logout) -> logout.permitAll());

        return http.build();
    }

    //Necesario para que se pueda acceder a recursos estaticos
    @Bean
    public WebSecurityCustomizer ignoringCustomizer() {
        return (web) -> web.ignoring().requestMatchers("/img/**", "/styles/**", "/scripts/**");
    }
}
