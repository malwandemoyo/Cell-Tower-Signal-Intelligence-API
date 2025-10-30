package com.mcphackathon.signal_intelligence.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mcphackathon.signal_intelligence.entity.CellTower;

import java.util.List;
import java.util.Optional;

@Repository
public interface CellTowerRepository extends JpaRepository<CellTower, Long> {
    
    // Find by radio type
    List<CellTower> findByRadio(String radio);
    Page<CellTower> findByRadio(String radio, Pageable pageable);
    
    // Find by MCC (Mobile Country Code)
    List<CellTower> findByMcc(Integer mcc);
    Page<CellTower> findByMcc(Integer mcc, Pageable pageable);
    
    // Find by network code
    List<CellTower> findByNet(Integer net);
    
    // Find by area code
    List<CellTower> findByArea(Integer area);

   
    List<CellTower> findByCell(Integer cell);
    
    // Find by location within bounds
    @Query("SELECT ct FROM CellTower ct WHERE ct.lon BETWEEN :minLon AND :maxLon AND ct.lat BETWEEN :minLat AND :maxLat")
    List<CellTower> findByLocationWithinBounds(@Param("minLon") Double minLon, 
                                              @Param("maxLon") Double maxLon,
                                              @Param("minLat") Double minLat, 
                                              @Param("maxLat") Double maxLat);
    
    // Find by radio type and country code
    List<CellTower> findByRadioAndMcc(String radio, Integer mcc);
    
    // Find towers with samples greater than specified value
    List<CellTower> findBySamplesGreaterThan(Integer samples);
    
    // Find by changeable flag
    List<CellTower> findByChangeable(Integer changeable);
    
    // Count by radio type
    Long countByRadio(String radio);
    
    // Find by average signal strength range
    @Query("SELECT ct FROM CellTower ct WHERE ct.averageSignal BETWEEN :minSignal AND :maxSignal")
    List<CellTower> findByAverageSignalBetween(@Param("minSignal") Integer minSignal, 
                                              @Param("maxSignal") Integer maxSignal);
    
    // REMOVED: Don't need custom count method, JpaRepository already provides count()
}