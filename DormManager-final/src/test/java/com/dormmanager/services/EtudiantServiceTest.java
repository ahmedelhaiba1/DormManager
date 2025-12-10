package com.dormmanager.services;

import com.dormmanager.entity.Affectation;
import com.dormmanager.entity.Chambre;
import com.dormmanager.entity.DemandeHebergement;
import com.dormmanager.entity.Etudiant;
import com.dormmanager.entity.Reclamation;
import com.dormmanager.entity.StatutDemande;
import com.dormmanager.entity.Utilisateur;
import com.dormmanager.repository.AffectationRepository;
import com.dormmanager.repository.ChambreRepository;
import com.dormmanager.repository.DemandeHebergementRepository;
import com.dormmanager.repository.EtudiantRepository;
import com.dormmanager.repository.ReclamationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("EtudiantService Tests")
class EtudiantServiceTest {

    @Mock
    private DemandeHebergementRepository demandeRepo;

    @Mock
    private EtudiantRepository etudiantRepo;

    @Mock
    private ReclamationRepository reclamationRepo;

    @Mock
    private AffectationRepository affectationRepo;

    @Mock
    private ChambreRepository chambreRepo;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private EtudiantService etudiantService;

    private Etudiant testStudent;
    private Chambre testChambre;
    private DemandeHebergement testDemande;
    private Affectation testAffectation;

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
        testChambre.setEtat("disponible");

        testDemande = new DemandeHebergement();
        testDemande.setEtudiant(testStudent);
        testDemande.setMotif("Je cherche un logement");
        testDemande.setStatut(StatutDemande.EN_ATTENTE);
        testDemande.setDateSoumission(new Date());

        testAffectation = new Affectation();
        testAffectation.setId(1L);
        testAffectation.setEtudiant(testStudent);
        testAffectation.setChambre(testChambre);
        testAffectation.setDateDebut(LocalDate.now());
        testAffectation.setDateFin(LocalDate.now().plusDays(30));
    }

    @Test
    @DisplayName("Should create demande successfully when student has no active affectation")
    void testCreateDemandeSuccessfully() {
        // Arrange
        when(etudiantRepo.findById(1L)).thenReturn(Optional.of(testStudent));
        when(affectationRepo.existsActiveAffectationByEtudiantId(anyLong(), any())).thenReturn(false);
        when(demandeRepo.existsByEtudiantIdAndStatut(anyLong(), any())).thenReturn(false);
        when(demandeRepo.save(any(DemandeHebergement.class))).thenReturn(testDemande);

        // Act
        var result = etudiantService.createDemande(1L, "Je cherche un logement");

        // Assert
        assertNotNull(result);
        assertEquals(StatutDemande.EN_ATTENTE, result.getStatut());
        verify(demandeRepo, times(1)).save(any(DemandeHebergement.class));
        verify(notificationService, times(1)).notifyAllGestionnaires(any(), any(), any());
    }

    @Test
    @DisplayName("Should throw exception when student already has active affectation")
    void testCreateDemandeWithActiveAffectation() {
        // Arrange
        when(etudiantRepo.findById(1L)).thenReturn(Optional.of(testStudent));
        when(affectationRepo.existsActiveAffectationByEtudiantId(anyLong(), any())).thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> etudiantService.createDemande(1L, "Je cherche un logement"));
        verify(notificationService, times(1)).sendNotification(any(), eq("error"), any(), any());
    }

    @Test
    @DisplayName("Should throw exception when student already has pending demande")
    void testCreateDemandeWithPendingDemande() {
        // Arrange
        when(etudiantRepo.findById(1L)).thenReturn(Optional.of(testStudent));
        when(affectationRepo.existsActiveAffectationByEtudiantId(anyLong(), any())).thenReturn(false);
        when(demandeRepo.existsByEtudiantIdAndStatut(anyLong(), any())).thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> etudiantService.createDemande(1L, "Je cherche un logement"));
    }

    @Test
    @DisplayName("Should get demandes by etudiant successfully")
    void testGetDemandesByEtudiant() {
        // Arrange
        when(demandeRepo.findByEtudiantId(1L)).thenReturn(java.util.List.of(testDemande));

        // Act
        var result = etudiantService.getDemandesByEtudiant(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testDemande.getMotif(), result.get(0).getMotif());
        verify(demandeRepo, times(1)).findByEtudiantId(1L);
    }

    @Test
    @DisplayName("Should count demandes en cours successfully")
    void testCountDemandesEnCours() {
        // Arrange
        when(demandeRepo.countByEtudiantAndStatut(testStudent, StatutDemande.EN_ATTENTE)).thenReturn(2L);

        // Act
        var result = etudiantService.countDemandesEnCours(testStudent);

        // Assert
        assertEquals(2L, result);
        verify(demandeRepo, times(1)).countByEtudiantAndStatut(testStudent, StatutDemande.EN_ATTENTE);
    }

    @Test
    @DisplayName("Should get reclamations successfully")
    void testGetReclamations() {
        // Arrange
        Reclamation reclamation = new Reclamation();
        reclamation.setId(1L);
        reclamation.setMessage("Problème avec la chambre");
        when(reclamationRepo.findByUtilisateurOrderByDateEnvoiDesc(testStudent)).thenReturn(java.util.List.of(reclamation));

        // Act
        var result = etudiantService.getReclamations(testStudent);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(reclamationRepo, times(1)).findByUtilisateurOrderByDateEnvoiDesc(testStudent);
    }

    @Test
    @DisplayName("Should create reclamation successfully")
    void testCreateReclamation() {
        // Arrange
        Reclamation reclamation = new Reclamation();
        reclamation.setId(1L);
        reclamation.setMessage("Problème avec la chambre");
        reclamation.setUtilisateur(testStudent);

        when(reclamationRepo.save(any(Reclamation.class))).thenReturn(reclamation);

        // Act
        var result = etudiantService.createReclamation(testStudent, "Problème avec la chambre");

        // Assert
        assertNotNull(result);
        assertEquals("Problème avec la chambre", result.getMessage());
        verify(reclamationRepo, times(1)).save(any(Reclamation.class));
        verify(notificationService, times(1)).notifyAllGestionnaires(any(), any(), any());
    }

    @Test
    @DisplayName("Should count reclamations successfully")
    void testCountReclamations() {
        // Arrange
        when(reclamationRepo.countByUtilisateur(testStudent)).thenReturn(3L);

        // Act
        var result = etudiantService.countReclamations(testStudent);

        // Assert
        assertEquals(3L, result);
        verify(reclamationRepo, times(1)).countByUtilisateur(testStudent);
    }

    @Test
    @DisplayName("Should get current affectation successfully")
    void testGetCurrentAffectation() {
        // Arrange
        when(affectationRepo.findTopByEtudiantIdOrderByDateDebutDesc(1L)).thenReturn(testAffectation);

        // Act
        var result = etudiantService.getCurrentAffectation(testStudent);

        // Assert
        assertNotNull(result);
        assertEquals(testChambre.getNumero(), result.getChambre().getNumero());
    }

    @Test
    @DisplayName("Should return null when affectation is expired")
    void testGetCurrentAffectationExpired() {
        // Arrange
        testAffectation.setDateFin(LocalDate.now().minusDays(1));
        when(affectationRepo.findTopByEtudiantIdOrderByDateDebutDesc(1L)).thenReturn(testAffectation);

        // Act
        var result = etudiantService.getCurrentAffectation(testStudent);

        // Assert
        assertNull(result);
    }

    @Test
    @DisplayName("Should return null when student has no affectation")
    void testGetCurrentAffectationNone() {
        // Arrange
        when(affectationRepo.findTopByEtudiantIdOrderByDateDebutDesc(1L)).thenReturn(null);

        // Act
        var result = etudiantService.getCurrentAffectation(testStudent);

        // Assert
        assertNull(result);
    }

    @Test
    @DisplayName("Should quit affectation successfully")
    void testQuitterAffectation() {
        // Arrange
        when(affectationRepo.findTopByEtudiantIdOrderByDateDebutDesc(1L)).thenReturn(testAffectation);
        when(affectationRepo.save(any(Affectation.class))).thenReturn(testAffectation);
        when(chambreRepo.save(any(Chambre.class))).thenReturn(testChambre);

        // Act
        etudiantService.quitterAffectation(testStudent, "Fin de semestre");

        // Assert
        assertEquals(LocalDate.now(), testAffectation.getDateFin());
        assertEquals("disponible", testChambre.getEtat());
        verify(affectationRepo, times(1)).save(any(Affectation.class));
        verify(chambreRepo, times(1)).save(any(Chambre.class));
        verify(notificationService, times(1)).sendNotification(any(), any(), any(), any());
    }

    @Test
    @DisplayName("Should throw exception when quitting without active affectation")
    void testQuitterAffectationNoActive() {
        // Arrange
        when(affectationRepo.findTopByEtudiantIdOrderByDateDebutDesc(1L)).thenReturn(null);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> etudiantService.quitterAffectation(testStudent, "Fin"));
    }

    @Test
    @DisplayName("Should get latest affectation (alias)")
    void testGetLatestAffectation() {
        // Arrange
        when(affectationRepo.findTopByEtudiantIdOrderByDateDebutDesc(1L)).thenReturn(testAffectation);

        // Act
        var result = etudiantService.getLatestAffectation(testStudent);

        // Assert
        assertNotNull(result);
        assertEquals(testChambre.getNumero(), result.getChambre().getNumero());
    }
}
