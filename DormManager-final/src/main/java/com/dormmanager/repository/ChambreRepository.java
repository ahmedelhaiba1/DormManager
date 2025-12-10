
package com.dormmanager.repository;

import com.dormmanager.entity.Chambre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;


public interface ChambreRepository extends JpaRepository<Chambre, Long> {

    long countByEtatIgnoreCase(String etat);

    List<Chambre> findByEtatIgnoreCase(String etat);

    List<Chambre> findByEtat(String etat);

    List<Chambre> findByEtatAndType(String etat, String type);

    @Query("SELECT c FROM Chambre c WHERE LOWER(c.etat) = 'disponible'")
    List<Chambre> findAllDisponibles();

}
