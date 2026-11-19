package com.pasteleria.milsabores.service;

import com.pasteleria.milsabores.dto.UsuarioResponse;
import com.pasteleria.milsabores.entity.Rol;
import com.pasteleria.milsabores.entity.Usuario;
import com.pasteleria.milsabores.repository.RolRepository;
import com.pasteleria.milsabores.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(UsuarioResponse::new)
                .collect(Collectors.toList());
    }

    public UsuarioResponse obtenerPorId(Long id) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return new UsuarioResponse(u);
    }

    @Transactional
    public UsuarioResponse actualizar(Long id, UsuarioResponse dto) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        if (dto.getNombre() != null) u.setNombre(dto.getNombre());
        if (dto.getApellidos() != null) u.setApellidos(dto.getApellidos());
        if (dto.getTelefono() != null) u.setTelefono(dto.getTelefono());
        if (dto.getDireccion() != null) u.setDireccion(dto.getDireccion());
        if (dto.getDepartamento() != null) u.setDepartamento(dto.getDepartamento());
        if (dto.getRegion() != null) u.setRegion(dto.getRegion());
        if (dto.getComuna() != null) u.setComuna(dto.getComuna());
        if (dto.getIndicaciones() != null) u.setIndicaciones(dto.getIndicaciones());

        if (dto.getRol() != null) {
            String rolNombre = "ROLE_" + dto.getRol().toUpperCase();
            Rol r = rolRepository.findByNombre(rolNombre)
                    .orElseGet(() -> rolRepository.save(new Rol(null, rolNombre)));
            u.setRol(r);
        }

        return new UsuarioResponse(usuarioRepository.save(u));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }
}
