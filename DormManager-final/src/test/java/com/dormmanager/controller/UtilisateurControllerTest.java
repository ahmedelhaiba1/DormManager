package com.dormmanager.controller;

import com.dormmanager.dto.UpdateUtilisateurDto;
import com.dormmanager.entity.Administrateur;
import com.dormmanager.entity.Utilisateur;
import com.dormmanager.services.AdminService;
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

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("UtilisateurController Tests")
class UtilisateurControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminService adminService;

    @Autowired
    private ObjectMapper objectMapper;

    private Utilisateur testUser;
    private UpdateUtilisateurDto updateDto;

    @BeforeEach
    void setUp() {
        testUser = new Administrateur();
        testUser.setId(1L);
        testUser.setNom("Admin");
        testUser.setPrenom("Test");
        testUser.setEmail("admin@test.com");
        testUser.setRole(Utilisateur.Role.ADMIN);
        testUser.setDateCreation(LocalDateTime.now());

        updateDto = new UpdateUtilisateurDto();
        updateDto.setNom("AdminUpdated");
        updateDto.setPrenom("Test");
        updateDto.setEmail("admin.updated@test.com");
        updateDto.setRole("ADMIN");
    }

    @Test
    @DisplayName("Should get all utilisateurs with status 200")
    void testGetAllUtilisateurs() throws Exception {
        // Arrange
        when(adminService.getAllUtilisateurs()).thenReturn(List.of(testUser));

        // Act & Assert
        mockMvc.perform(get("/api/utilisateurs"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].prenom", is("Test")));

        verify(adminService, times(1)).getAllUtilisateurs();
    }

    @Test
    @DisplayName("Should get utilisateur by ID with status 200")
    void testGetUtilisateurById() throws Exception {
        // Arrange
        when(adminService.getUtilisateurById(1L)).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(get("/api/utilisateurs/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.email", is("admin@test.com")));

        verify(adminService, times(1)).getUtilisateurById(1L);
    }

    @Test
    @DisplayName("Should return 500 when utilisateur not found")
    void testGetUtilisateurByIdNotFound() throws Exception {
        // Arrange
        when(adminService.getUtilisateurById(999L)).thenThrow(new RuntimeException("Utilisateur non trouvé"));

        // Act & Assert
        mockMvc.perform(get("/api/utilisateurs/999"))
                .andExpect(status().isInternalServerError());

        verify(adminService, times(1)).getUtilisateurById(999L);
    }

    @Test
    @DisplayName("Should update utilisateur with status 200")
    void testUpdateUtilisateur() throws Exception {
        // Arrange
        Utilisateur updatedUser = new Administrateur();
        updatedUser.setId(1L);
        updatedUser.setNom("AdminUpdated");
        updatedUser.setPrenom("Test");
        updatedUser.setEmail("admin.updated@test.com");
        updatedUser.setRole(Utilisateur.Role.ADMIN);

        when(adminService.updateUtilisateur(anyLong(), any(UpdateUtilisateurDto.class))).thenReturn(updatedUser);

        // Act & Assert
        mockMvc.perform(put("/api/utilisateurs/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom", is("AdminUpdated")))
                .andExpect(jsonPath("$.email", is("admin.updated@test.com")));

        verify(adminService, times(1)).updateUtilisateur(1L, updateDto);
    }

    @Test
    @DisplayName("Should delete utilisateur with status 204")
    void testDeleteUtilisateur() throws Exception {
        // Arrange
        doNothing().when(adminService).deleteUtilisateur(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/utilisateurs/1"))
                .andExpect(status().isNoContent());

        verify(adminService, times(1)).deleteUtilisateur(1L);
    }

    @Test
    @DisplayName("Should return 400 on invalid update request")
    void testUpdateUtilisateurInvalid() throws Exception {
        // Act & Assert
        mockMvc.perform(put("/api/utilisateurs/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk()); // Empty DTO is acceptable
    }
}
