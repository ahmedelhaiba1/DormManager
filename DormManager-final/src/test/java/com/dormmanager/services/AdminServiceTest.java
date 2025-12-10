package com.dormmanager.services;

import com.dormmanager.dto.DashboardStatsDto;
import com.dormmanager.dto.UpdateUtilisateurDto;
import com.dormmanager.entity.Administrateur;
import com.dormmanager.entity.Etudiant;
import com.dormmanager.entity.Utilisateur;
import com.dormmanager.repository.AffectationRepository;
import com.dormmanager.repository.ChambreRepository;
import com.dormmanager.repository.DemandeHebergementRepository;
import com.dormmanager.repository.NotificationRepository;
import com.dormmanager.repository.ReclamationRepository;
import com.dormmanager.repository.UtilisateurRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AdminService Tests")
class AdminServiceTest {

    @Mock
    private UtilisateurRepository utilisateurRepository;

    @Mock
    private ChambreRepository chambreRepository;

    @Mock
    private AffectationRepository affectationRepository;

    @Mock
    private DemandeHebergementRepository demandeHebergementRepository;

    @Mock
    private ReclamationRepository reclamationRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AdminService adminService;

    private Utilisateur testUser;

    @BeforeEach
    void setUp() {
        testUser = new Administrateur();
        testUser.setId(1L);
        testUser.setNom("Test");
        testUser.setPrenom("Admin");
        testUser.setEmail("admin@test.com");
        testUser.setRole(Utilisateur.Role.ADMIN);
        testUser.setDateCreation(LocalDateTime.now());
    }

    @Test
    @DisplayName("Should get all utilisateurs successfully")
    void testGetAllUtilisateurs() {
        // Arrange
        when(utilisateurRepository.findAll()).thenReturn(java.util.List.of(testUser));

        // Act
        var result = adminService.getAllUtilisateurs();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(utilisateurRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should get utilisateur by ID successfully")
    void testGetUtilisateurById() {
        // Arrange
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        var result = adminService.getUtilisateurById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Admin", result.getPrenom());
        verify(utilisateurRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when utilisateur not found")
    void testGetUtilisateurByIdNotFound() {
        // Arrange
        when(utilisateurRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> adminService.getUtilisateurById(999L));
        verify(utilisateurRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Should update utilisateur successfully")
    void testUpdateUtilisateur() {
        // Arrange
        UpdateUtilisateurDto dto = new UpdateUtilisateurDto();
        dto.setNom("Updated");
        dto.setPrenom("Name");
        dto.setEmail("updated@test.com");
        dto.setRole("ADMIN");

        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(utilisateurRepository.save(any(Utilisateur.class))).thenReturn(testUser);

        // Act
        var result = adminService.updateUtilisateur(1L, dto);

        // Assert
        assertNotNull(result);
        assertEquals("Updated", result.getNom());
        verify(utilisateurRepository, times(1)).findById(1L);
        verify(utilisateurRepository, times(1)).save(any(Utilisateur.class));
        verify(notificationService, times(1)).sendNotification(any(), any(), any(), any());
    }

    @Test
    @DisplayName("Should delete utilisateur and cascade delete related records")
    void testDeleteUtilisateur() {
        // Arrange
        Etudiant student = new Etudiant();
        student.setId(2L);
        student.setRole(Utilisateur.Role.ETUDIANT);

        when(utilisateurRepository.findById(2L)).thenReturn(Optional.of(student));

        // Act
        adminService.deleteUtilisateur(2L);

        // Assert
        verify(notificationRepository, times(1)).deleteByDestinataireId(2L);
        verify(reclamationRepository, times(1)).deleteByUtilisateurId(2L);
        verify(affectationRepository, times(1)).deleteByEtudiantId(2L);
        verify(demandeHebergementRepository, times(1)).deleteByEtudiantId(2L);
        verify(utilisateurRepository, times(1)).deleteById(2L);
    }

    @Test
    @DisplayName("Should delete non-student utilisateur without cascading to student records")
    void testDeleteNonStudentUtilisateur() {
        // Arrange
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        adminService.deleteUtilisateur(1L);

        // Assert
        verify(notificationRepository, times(1)).deleteByDestinataireId(1L);
        verify(reclamationRepository, times(1)).deleteByUtilisateurId(1L);
        verify(affectationRepository, never()).deleteByEtudiantId(anyLong());
        verify(demandeHebergementRepository, never()).deleteByEtudiantId(anyLong());
        verify(utilisateurRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should create utilisateur successfully")
    void testCreateUtilisateur() {
        // Arrange
        when(utilisateurRepository.findByEmail("new@test.com")).thenReturn(null);
        when(utilisateurRepository.save(any(Utilisateur.class))).thenReturn(testUser);

        // Act
        var result = adminService.createUtilisateur("New", "User", "new@test.com", "password123", "ADMIN");

        // Assert
        assertNotNull(result);
        verify(utilisateurRepository, times(1)).findByEmail("new@test.com");
        verify(utilisateurRepository, times(1)).save(any(Utilisateur.class));
    }

    @Test
    @DisplayName("Should throw exception when email already exists")
    void testCreateUtilisateurEmailExists() {
        // Arrange
        when(utilisateurRepository.findByEmail("admin@test.com")).thenReturn(testUser);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> 
            adminService.createUtilisateur("New", "User", "admin@test.com", "password123", "ADMIN")
        );
    }

    @Test
    @DisplayName("Should get dashboard statistics successfully")
    void testGetDashboardStats() {
        // Arrange
        when(affectationRepository.countDistinctEtudiantsLoges(any())).thenReturn(5L);
        when(chambreRepository.countByEtatIgnoreCase("disponible")).thenReturn(10L);
        when(demandeHebergementRepository.countByStatut(any())).thenReturn(3L);
        when(reclamationRepository.countByEnAttenteOrNull()).thenReturn(2L);
        when(utilisateurRepository.count()).thenReturn(20L);
        when(utilisateurRepository.countByDateCreationBetween(any(), any())).thenReturn(2L);
        when(chambreRepository.count()).thenReturn(50L);
        when(utilisateurRepository.countByRole(any())).thenReturn(5L);

        // Act
        DashboardStatsDto result = adminService.getDashboardStats();

        // Assert
        assertNotNull(result);
        assertEquals(5L, result.getNbEtudiantsLoges());
        assertEquals(10L, result.getNbChambresDisponibles());
        assertEquals(3L, result.getNbDemandesEnAttente());
    }
}
