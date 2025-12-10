package com.dormmanager.controller;

import com.dormmanager.dto.AffectationRequestDto;
import com.dormmanager.dto.ChambreRequestDto;
import com.dormmanager.dto.DashboardStatsDto;
import com.dormmanager.entity.Affectation;
import com.dormmanager.entity.Chambre;
import com.dormmanager.entity.DemandeHebergement;
import com.dormmanager.entity.Etudiant;
import com.dormmanager.entity.StatutDemande;
import com.dormmanager.services.GestionnaireService;
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
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("GestionnaireController Tests")
class GestionnaireControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GestionnaireService gestionnaireService;

    @Autowired
    private ObjectMapper objectMapper;

    private Chambre testChambre;
    private Etudiant testStudent;
    private DemandeHebergement testDemande;
    private ChambreRequestDto chambreDto;
    private AffectationRequestDto affectationDto;
    private DashboardStatsDto statsDto;

    @BeforeEach
    void setUp() {
        testChambre = new Chambre();
        testChambre.setId(1L);
        testChambre.setNumero("101");
        testChambre.setType("Simple");
        testChambre.setCapacite(1);
        testChambre.setEtat("disponible");

        testStudent = new Etudiant();
        testStudent.setId(1L);
        testStudent.setNom("Student");
        testStudent.setPrenom("Test");

        testDemande = new DemandeHebergement();
        testDemande.setEtudiant(testStudent);
        testDemande.setStatut(StatutDemande.EN_ATTENTE);

        chambreDto = new ChambreRequestDto();
        chambreDto.setNumero("101");
        chambreDto.setType("Simple");
        chambreDto.setCapacite(1);
        chambreDto.setEtat("disponible");

        affectationDto = new AffectationRequestDto();
        affectationDto.setDemandeId(1L);
        affectationDto.setChambreId(1L);
        affectationDto.setDateDebut(LocalDate.now());
        affectationDto.setDateFin(LocalDate.now().plusDays(30));

        statsDto = new DashboardStatsDto(5, 10, 3, 2, 0, 0.0, 0, 0.0, 0, 0, 0, 0, 0, 0);
    }

    @Test
    @DisplayName("Should get demandes en attente with status 200")
    void testGetDemandesEnAttente() throws Exception {
        // Arrange
        when(gestionnaireService.getDemandesEnAttente()).thenReturn(List.of());

        // Act & Assert
        mockMvc.perform(get("/api/gestionnaire/demandes"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

        verify(gestionnaireService, times(1)).getDemandesEnAttente();
    }

    @Test
    @DisplayName("Should get dashboard stats with status 200")
    void testGetDashboardStats() throws Exception {
        // Arrange
        when(gestionnaireService.getDashboardStats()).thenReturn(statsDto);

        // Act & Assert
        mockMvc.perform(get("/api/gestionnaire/stats"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.nbEtudiantsLoges", is(5)))
                .andExpect(jsonPath("$.nbChambresDisponibles", is(10)))
                .andExpect(jsonPath("$.nbDemandesEnAttente", is(3)));

        verify(gestionnaireService, times(1)).getDashboardStats();
    }

    @Test
    @DisplayName("Should get chambres disponibles with status 200")
    void testGetChambresDisponibles() throws Exception {
        // Arrange
        when(gestionnaireService.getChambresDisponibles()).thenReturn(List.of(testChambre));

        // Act & Assert
        mockMvc.perform(get("/api/gestionnaire/chambres-disponibles"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].numero", is("101")))
                .andExpect(jsonPath("$[0].etat", is("disponible")));

        verify(gestionnaireService, times(1)).getChambresDisponibles();
    }

    @Test
    @DisplayName("Should affecter and validate demande with status 200")
    void testAffecterEtValiderDemande() throws Exception {
        // Arrange
        Affectation affectation = new Affectation();
        affectation.setId(1L);
        affectation.setEtudiant(testStudent);
        affectation.setChambre(testChambre);

        when(gestionnaireService.affecterEtValiderDemande(any(AffectationRequestDto.class)))
                .thenReturn(affectation);

        // Act & Assert
        mockMvc.perform(post("/api/gestionnaire/affecter-et-valider")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(affectationDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.etudiant.nom", is("Student")));

        verify(gestionnaireService, times(1)).affecterEtValiderDemande(any(AffectationRequestDto.class));
    }

    @Test
    @DisplayName("Should reject demande with status 200")
    void testRejeterDemande() throws Exception {
        // Arrange
        testDemande.setStatut(StatutDemande.REJETEE);
        when(gestionnaireService.rejeterDemande(1L)).thenReturn(testDemande);

        // Act & Assert
        mockMvc.perform(put("/api/gestionnaire/rejeter-demande/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statut", is("REJETEE")));

        verify(gestionnaireService, times(1)).rejeterDemande(1L);
    }

    @Test
    @DisplayName("Should get dernières reclamations with status 200")
    void testGetDernieresReclamations() throws Exception {
        // Arrange
        when(gestionnaireService.getDernieresReclamations()).thenReturn(List.of());

        // Act & Assert
        mockMvc.perform(get("/api/gestionnaire/dernieres-reclamations"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

        verify(gestionnaireService, times(1)).getDernieresReclamations();
    }

    @Test
    @DisplayName("Should return error when affectation fails")
    void testAffecterEtValiderDemandeError() throws Exception {
        // Arrange
        when(gestionnaireService.affecterEtValiderDemande(any(AffectationRequestDto.class)))
                .thenThrow(new IllegalArgumentException("Demande introuvable"));

        // Act & Assert
        mockMvc.perform(post("/api/gestionnaire/affecter-et-valider")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(affectationDto)))
                .andExpect(status().isInternalServerError());

        verify(gestionnaireService, times(1)).affecterEtValiderDemande(any(AffectationRequestDto.class));
    }
}
