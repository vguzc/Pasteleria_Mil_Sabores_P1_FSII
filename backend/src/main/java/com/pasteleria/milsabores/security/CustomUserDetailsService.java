package com.pasteleria.milsabores.security;

import com.pasteleria.milsabores.entity.Usuario;
import com.pasteleria.milsabores.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con correo: " + correo));

        String rolNombre = usuario.getRol().getNombre();
        // Asegurar prefijo ROLE_
        if (!rolNombre.startsWith("ROLE_")) {
            rolNombre = "ROLE_" + rolNombre.toUpperCase();
        }

        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(rolNombre));

        return new User(
                usuario.getCorreo(),
                usuario.getClave(),
                authorities
        );
    }
}
