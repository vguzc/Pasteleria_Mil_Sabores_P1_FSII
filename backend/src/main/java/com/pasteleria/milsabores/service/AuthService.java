package com.pasteleria.milsabores.service;

import com.pasteleria.milsabores.dto.AuthResponse;
import com.pasteleria.milsabores.dto.LoginRequest;
import com.pasteleria.milsabores.dto.RegistroRequest;
import com.pasteleria.milsabores.dto.UsuarioResponse;
import com.pasteleria.milsabores.entity.Rol;
import com.pasteleria.milsabores.entity.Usuario;
import com.pasteleria.milsabores.repository.RolRepository;
import com.pasteleria.milsabores.repository.UsuarioRepository;
import com.pasteleria.milsabores.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getClave())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado tras autenticar"));

        return new AuthResponse(jwt, new UsuarioResponse(usuario));
    }

    @Transactional
    public AuthResponse registrar(RegistroRequest request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new RuntimeException("El correo ya se encuentra registrado");
        }

        Rol rolCliente = rolRepository.findByNombre("ROLE_CLIENTE")
                .orElseGet(() -> rolRepository.save(new Rol(null, "ROLE_CLIENTE")));

        Usuario usuario = new Usuario();
        usuario.setCodigo("USR-" + System.currentTimeMillis() % 100000);
        usuario.setNombre(request.getNombre());
        usuario.setApellidos(request.getApellidos());
        usuario.setCorreo(request.getCorreo());
        usuario.setClave(passwordEncoder.encode(request.getClave()));
        usuario.setRol(rolCliente);
        usuario.setRut(request.getRut());
        usuario.setFechaNacimiento(request.getFechaNacimiento());
        usuario.setTelefono(request.getTelefono());
        usuario.setDireccion(request.getDireccion());
        usuario.setDepartamento(request.getDepartamento());
        usuario.setRegion(request.getRegion());
        usuario.setComuna(request.getComuna());
        usuario.setIndicaciones(request.getIndicaciones());

        Usuario guardado = usuarioRepository.save(usuario);

        String jwt = tokenProvider.generateTokenFromUser(guardado.getCorreo(), "ROLE_CLIENTE");

        return new AuthResponse(jwt, new UsuarioResponse(guardado));
    }

    public UsuarioResponse obtenerPerfil(String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con correo: " + correo));
        return new UsuarioResponse(usuario);
    }
}
