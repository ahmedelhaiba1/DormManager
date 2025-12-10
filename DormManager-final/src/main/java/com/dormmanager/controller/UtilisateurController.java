package com.dormmanager.controller;

import com.dormmanager.dto.UpdateUtilisateurDto;
import com.dormmanager.entity.Utilisateur;
import com.dormmanager.services.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "*")
public class UtilisateurController {

    private final AdminService adminService;

    public UtilisateurController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Get all users (Admin dashboard)
    @GetMapping
    public List<Utilisateur> getAllUtilisateurs() {
        return adminService.getAllUtilisateurs();
    }

    // Get a single user by ID
    @GetMapping("/{id}")
    public Utilisateur getUtilisateurById(@PathVariable Long id) {
        return adminService.getUtilisateurById(id);
    }

    // Delete user by ID
    @DeleteMapping("/{id}")
    public void deleteUtilisateur(@PathVariable Long id) {
        adminService.deleteUtilisateur(id);
    }

    // Update user by ID
    @PutMapping("/{id}")
    public Utilisateur updateUtilisateur(@PathVariable Long id, @RequestBody UpdateUtilisateurDto dto) {
        return adminService.updateUtilisateur(id, dto);
    }
}
