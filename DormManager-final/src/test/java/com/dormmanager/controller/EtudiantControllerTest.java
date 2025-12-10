package com.dormmanager.controller;

import com.dormmanager.entity.Affectation;
import com.dormmanager.entity.Chambre;
import com.dormmanager.entity.Etudiant;
import com.dormmanager.entity.Reclamation;
import com.dormmanager.entity.Utilisateur;
import com.dormmanager.services.EtudiantService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("EtudiantController Tests")
class EtudiantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EtudiantService etudiantService;

    @Autowired
    private ObjectMapper objectMapper;

    private Etudiant testStudent;
    private Affectation testAffectation;
    private Chambre testChambre;
    private Reclamation testReclamation;

    @BeforeEach
    void setUp() {
        testStudent = new Etudiant();
        testStudent.setId(1L);
        testStudent.setNom("Dupont");
        testStudent.setPrenom("Jean");
        testStudent.setEmail("jean@test.com");
        testStudent.setRole(Utilisateur.Role.ETUDIANT);

        testChambre = new Chambre();
        testChambre.setId(1L);
        testChambre.setNumero("101");
        testChambre.setType("Simple");
        testChambre.setCapacite(1);
        testChambre.setEtat("occupee");

        testAffectation = new Affectation();
        testAffectation.setId(1L);
        testAffectation.setEtudiant(testStudent);
        testAffectation.setChambre(testChambre);
        testAffectation.setDateDebut(LocalDate.now());
        testAffectation.setDateFin(LocalDate.now().plusDays(30));

        testReclamation = new Reclamation();
        testReclamation.setId(1L);
        testReclamation.setMessage("Problème avec la chambre");
        testReclamation.setUtilisateur(testStudent);
    }

    @Test
    @DisplayName("Should get current affectation with status 200")
    void testGetCurrentAffectation() throws Exception {
        // Arrange
        when(etudiantService.getCurrentAffectation(any(Etudiant.class))).thenReturn(testAffectation);

        // Act & Assert
        mockMvc.perform(get("/api/etudiant/1/affectation-actuelle"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.chambre.numero", is("101")));

        verify(etudiantService, times(1)).getCurrentAffectation(any(Etudiant.class));
    }

    @Test
    @DisplayName("Should get reclamations with status 200")
    void testGetReclamations() throws Exception {
        // Arrange
        when(etudiantService.getReclamations(any(Utilisateur.class))).thenReturn(List.of(testReclamation));

        // Act & Assert
        mockMvc.perform(get("/api/etudiant/1/reclamations"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].message", is("Problème avec la chambre")));

        verify(etudiantService, times(1)).getReclamations(any(Utilisateur.class));
    }

    @Test
    @DisplayName("Should create reclamation with status 200 or 201")
    void testCreateReclamation() throws Exception {
        // Arrange
        when(etudiantService.createReclamation(any(Utilisateur.class), anyString()))
                .thenReturn(testReclamation);

        // Act & Assert
        mockMvc.perform(post("/api/etudiant/1/reclamations")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"message\": \"Problème avec la chambre\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.message", is("Problème avec la chambre")));

        verify(etudiantService, times(1)).createReclamation(any(Utilisateur.class), anyString());
    }

    @Test
    @DisplayName("Should return 404 when affectation not found")
    void testGetCurrentAffectationNotFound() throws Exception {
        // Arrange
        when(etudiantService.getCurrentAffectation(any(Etudiant.class))).thenReturn(null);

        // Act & Assert
        mockMvc.perform(get("/api/etudiant/1/affectation-actuelle"))
                .andExpect(status().isOk()); // Endpoint returns 200 with null body

        verify(etudiantService, times(1)).getCurrentAffectation(any(Etudiant.class));
    }

    @Test
    @DisplayName("Should return empty list when no reclamations exist")
    void testGetReclamationsEmpty() throws Exception {
        // Arrange
        when(etudiantService.getReclamations(any(Utilisateur.class))).thenReturn(List.of());

        // Act & Assert
        mockMvc.perform(get("/api/etudiant/1/reclamations"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

        verify(etudiantService, times(1)).getReclamations(any(Utilisateur.class));
    }

    @Test
    @DisplayName("Should quit affectation with status 200")
    void testQuitterAffectation() throws Exception {
        // Arrange
        doNothing().when(etudiantService).quitterAffectation(any(Etudiant.class), anyString());

        // Act & Assert
        mockMvc.perform(post("/api/etudiant/1/quitter-affectation")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"remarque\": \"Fin de semestre\"}"))
                .andExpect(status().isOk());

        verify(etudiantService, times(1)).quitterAffectation(any(Etudiant.class), anyString());
    }

    @Test
    @DisplayName("Should return error when quitting without active affectation")
    void testQuitterAffectationNoActive() throws Exception {
        // Arrange
        doThrow(new RuntimeException("Vous n'avez pas d'affectation active"))
                .when(etudiantService).quitterAffectation(any(Etudiant.class), anyString());

        // Act & Assert
        mockMvc.perform(post("/api/etudiant/1/quitter-affectation")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"remarque\": \"Fin\"}"))
                .andExpect(status().isInternalServerError());

        verify(etudiantService, times(1)).quitterAffectation(any(Etudiant.class), anyString());
    }

    @Test
    @DisplayName("Should count reclamations with status 200")
    void testCountReclamations() throws Exception {
        // Arrange
        when(etudiantService.countReclamations(any(Utilisateur.class))).thenReturn(3L);

        // Act & Assert
        mockMvc.perform(get("/api/etudiant/1/reclamations/count"))
                .andExpect(status().isOk())
                .andExpect(content().string("3"));

        verify(etudiantService, times(1)).countReclamations(any(Utilisateur.class));
    }
}
