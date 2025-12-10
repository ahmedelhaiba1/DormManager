/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dormmanager.controller;

/**
 *
 * @author User
 */

import com.dormmanager.controller.AuthController;
import com.dormmanager.entity.Etudiant;
import com.dormmanager.repository.EtudiantRepository;
import org.springframework.web.bind.annotation.*;
import com.dormmanager.entity.Utilisateur;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/etudiants")
@CrossOrigin(origins = "*")
public class EtudiantController {

    private final EtudiantRepository etudiantRepository;

    public EtudiantController(EtudiantRepository etudiantRepository) {
        this.etudiantRepository = etudiantRepository;
    }

    @PostMapping("/register")
    public Map<String, Object> registerEtudiant(@RequestBody Etudiant etudiant) {

    etudiant.setRole(Utilisateur.Role.ETUDIANT);
    Etudiant saved = etudiantRepository.save(etudiant);

    // Generate a session token
    String token = UUID.randomUUID().toString();

    // IMPORTANT: Add the token to the same active token map used in AuthController
    AuthController.activeTokens.put(token, saved.getEmail());

    Map<String, Object> response = new HashMap<>();
    response.put("user", saved);
    response.put("token", token);

    return response;
}

    // ✅ Get all students
    @GetMapping
    public List<Etudiant> getAllEtudiants() {
        return etudiantRepository.findAll();
    }

    // ✅ Get student by ID
    @GetMapping("/{id}")
    public Etudiant getEtudiant(@PathVariable Long id) {
        return etudiantRepository.findById(id).orElse(null);
    }

    // ✅ Create new student
    @PostMapping
    public Etudiant createEtudiant(@RequestBody Etudiant etudiant) {
        return etudiantRepository.save(etudiant);
    }

    // ✅ Update student
    @PutMapping("/{id}")
    public Etudiant updateEtudiant(@PathVariable Long id, @RequestBody Etudiant etudiant) {
        Etudiant existing = etudiantRepository.findById(id).orElseThrow();
        existing.setFiliere(etudiant.getFiliere());
        existing.setMatricule(etudiant.getMatricule());
        return etudiantRepository.save(existing);
    }

    // ✅ Delete student
    @DeleteMapping("/{id}")
    public void deleteEtudiant(@PathVariable Long id) {
        etudiantRepository.deleteById(id);
    }
}

