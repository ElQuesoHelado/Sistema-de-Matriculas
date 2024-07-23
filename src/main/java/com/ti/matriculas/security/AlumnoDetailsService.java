package com.ti.matriculas.security;

import com.ti.matriculas.entity.Alumno;
import com.ti.matriculas.repository.AlumnoRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AlumnoDetailsService implements UserDetailsService {
    private final AlumnoRepository alumnoRepository;

    public AlumnoDetailsService(AlumnoRepository userRepository) {
        this.alumnoRepository = userRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        System.out.println("String: " + username);
        final Alumno alumno = this.alumnoRepository.findByCui(Integer.parseInt(username));
        if (alumno == null) {
            throw new UsernameNotFoundException("Alumno desconocido " + username);
        }

//        System.out.println(alumno.getDni());
        return User.withUsername(Integer.toString(alumno.getCui()))
                .password("{noop}" + Integer.toString(alumno.getDni()))
                .roles()//Es un arreglo vació, sin roles
                .build();
    }
}
