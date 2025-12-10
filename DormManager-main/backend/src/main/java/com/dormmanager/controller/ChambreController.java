package com.dormmanager.controller;

import com.dormmanager.entity.Chambre;
import com.dormmanager.repository.ChambreRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chambres")
public class ChambreController {

    private final ChambreRepository repo;

    public ChambreController(ChambreRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Chambre> list() {
        return repo.findAll();
    }

    @PostMapping
    public Chambre create(@RequestBody Chambre c) {
        return repo.save(c);
    }

    @GetMapping("{id}")
    public ResponseEntity<Chambre> byId(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
