package com.dormmanager.services;

import com.dormmanager.dto.AffectationRequestDto;
import com.dormmanager.dto.ChambreRequestDto;
import com.dormmanager.dto.DashboardStatsDto;
import com.dormmanager.entity.Affectation;
import com.dormmanager.entity.Chambre;
import com.dormmanager.entity.DemandeHebergement;
import com.dormmanager.entity.Etudiant;
import com.dormmanager.entity.StatutDemande;
import com.dormmanager.repository.AffectationRepository;
import com.dormmanager.repository.ChambreRepository;
import com.dormmanager.repository.DemandeHebergementRepository;
import com.dormmanager.repository.ReclamationRepository;
import com.dormmanager.repository.UtilisateurRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GestionnaireService Tests")
class GestionnaireServiceTest {

    @Mock
    private DemandeHebergementRepository demandeHebergementRepository;

    @Mock
    private ChambreRepository chambreRepository;

    @Mock
    private AffectationRepository affectationRepository;

    @Mock
    private ReclamationRepository reclamationRepository;

    @Mock
    private UtilisateurRepository utilisateurRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private GestionnaireService gestionnaireService;

    private Chambre testChambre;
    private Etudiant testStudent;
    private DemandeHebergement testDemande;

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
    }

    @Test
    @DisplayName("Should add chambre successfully")
    void testAjouterChambre() {
        // Arrange
        ChambreRequestDto dto = new ChambreRequestDto();
        dto.setNumero("102");
        dto.setType("Double");
        dto.setCapacite(2);
        dto.setEtat("disponible");

        when(chambreRepository.save(any(Chambre.class))).thenReturn(testChambre);

        // Act
        var result = gestionnaireService.ajouterChambre(dto);

        // Assert
        assertNotNull(result);
        verify(chambreRepository, times(1)).save(any(Chambre.class));
    }

    @Test
    @DisplayName("Should get chambres disponibles successfully")
    void testGetChambresDisponibles() {
        // Arrange
        when(chambreRepository.findByEtatIgnoreCase("disponible")).thenReturn(java.util.List.of(testChambre));

        // Act
        var result = gestionnaireService.getChambresDisponibles();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("disponible", result.get(0).getEtat());
        verify(chambreRepository, times(1)).findByEtatIgnoreCase("disponible");
    }

    @Test
    @DisplayName("Should affecter et valider demande successfully")
    void testAffecterEtValiderDemande() {
        // Arrange
        AffectationRequestDto dto = new AffectationRequestDto();
        dto.setDemandeId(1L);
        dto.setChambreId(1L);
        dto.setDateDebut(LocalDate.now());
        dto.setDateFin(LocalDate.now().plusDays(30));

        when(demandeHebergementRepository.findById(1L)).thenReturn(Optional.of(testDemande));
        when(chambreRepository.findById(1L)).thenReturn(Optional.of(testChambre));
        when(affectationRepository.save(any(Affectation.class))).thenReturn(new Affectation());
        when(chambreRepository.save(any(Chambre.class))).thenReturn(testChambre);
        when(demandeHebergementRepository.save(any(DemandeHebergement.class))).thenReturn(testDemande);

        // Act
        var result = gestionnaireService.affecterEtValiderDemande(dto);

        // Assert
        assertNotNull(result);
        verify(affectationRepository, times(1)).save(any(Affectation.class));
        verify(demandeHebergementRepository, times(1)).save(any(DemandeHebergement.class));
        verify(notificationService, atLeast(2)).sendNotification(any(), any(), any(), any());
    }

    @Test
    @DisplayName("Should reject demande successfully")
    void testRejeterDemande() {
        // Arrange
        when(demandeHebergementRepository.findById(1L)).thenReturn(Optional.of(testDemande));
        when(demandeHebergementRepository.save(any(DemandeHebergement.class))).thenReturn(testDemande);

        // Act
        var result = gestionnaireService.rejeterDemande(1L, "Not eligible");

        // Assert
        assertNotNull(result);
        assertEquals(StatutDemande.REJETEE, result.getStatut());
        verify(demandeHebergementRepository, times(1)).save(any(DemandeHebergement.class));
        verify(notificationService, times(1)).sendNotification(any(), any(), any(), any());
    }

    @Test
    @DisplayName("Should valider demande successfully")
    void testValiderDemande() {
        // Arrange
        when(demandeHebergementRepository.findById(1L)).thenReturn(Optional.of(testDemande));
        when(demandeHebergementRepository.save(any(DemandeHebergement.class))).thenReturn(testDemande);

        // Act
        var result = gestionnaireService.validerDemande(1L);

        // Assert
        assertNotNull(result);
        assertEquals(StatutDemande.VALIDEE, result.getStatut());
        verify(demandeHebergementRepository, times(1)).save(any(DemandeHebergement.class));
        verify(notificationService, times(1)).sendNotification(any(), any(), any(), any());
    }

    @Test
    @DisplayName("Should throw exception when affectation chambre not disponible")
    void testAffecterDemandeChambreNotDisponible() {
        // Arrange
        testChambre.setEtat("occupee");
        AffectationRequestDto dto = new AffectationRequestDto();
        dto.setDemandeId(1L);
        dto.setChambreId(1L);

        when(demandeHebergementRepository.findById(1L)).thenReturn(Optional.of(testDemande));
        when(chambreRepository.findById(1L)).thenReturn(Optional.of(testChambre));

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> gestionnaireService.affecterEtValiderDemande(dto));
    }

    @Test
    @DisplayName("Should get dashboard stats successfully")
    void testGetDashboardStats() {
        // Arrange
        when(affectationRepository.countDistinctEtudiantsLoges(any())).thenReturn(5L);
        when(chambreRepository.countByEtatIgnoreCase("disponible")).thenReturn(10L);
        when(demandeHebergementRepository.countByStatut(StatutDemande.EN_ATTENTE)).thenReturn(3L);
        when(reclamationRepository.count()).thenReturn(2L);

        // Act
        DashboardStatsDto result = gestionnaireService.getDashboardStats();

        // Assert
        assertNotNull(result);
        assertEquals(5L, result.getNbEtudiantsLoges());
        assertEquals(10L, result.getNbChambresDisponibles());
        assertEquals(3L, result.getNbDemandesEnAttente());
    }

    @Test
    @DisplayName("Should notify admins on chambre add")
    void testNotifyAdminsOnChambreAdd() {
        // Act
        gestionnaireService.notifyAdminsOnChambreAdd(testChambre);

        // Assert
        verify(notificationService, times(1)).notifyAllAdmins("info", "Nouvelle chambre ajoutée", 
            String.format("Le gestionnaire a ajouté une nouvelle chambre %s.", testChambre.getNumero()));
    }

    @Test
    @DisplayName("Should notify on chambre add based on user role - admin")
    void testNotifyOnChambreAddAsAdmin() {
        // Arrange
        var admin = new com.dormmanager.entity.Administrateur();
        admin.setId(1L);
        admin.setRole(com.dormmanager.entity.Utilisateur.Role.ADMIN);

        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(admin));

        // Act
        gestionnaireService.notifyOnChambreAdd(testChambre, 1L);

        // Assert
        verify(notificationService, times(1)).notifyAllGestionnaires(any(), any(), any());
    }

    @Test
    @DisplayName("Should notify admins on affectation")
    void testNotifyAdminsOnAffectation() {
        // Act
        gestionnaireService.notifyAdminsOnAffectation("101", "John Doe");

        // Assert
        verify(notificationService, times(1)).notifyAllAdmins("info", "Nouvelle affectation enregistrée",
            String.format("Le gestionnaire a attribué la chambre %s à %s.", "101", "John Doe"));
    }
}
