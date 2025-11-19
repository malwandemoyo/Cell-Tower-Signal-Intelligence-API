package com.mcphackathon.signal_intelligence.service;



import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mcphackathon.signal_intelligence.entity.CellTower;

import java.util.List;
import java.util.Optional;

public interface CellTowerService {
    
    // Create
    CellTower createCellTower(CellTower cellTower);
    List<CellTower> createMultipleCellTowers(List<CellTower> cellTowers);
    
    // ADD THIS METHOD for DataLoader
    void saveAll(List<CellTower> cellTowers);
    
    // Read
    List<CellTower> getAllCellTowers();
    Page<CellTower> getAllCellTowers(Pageable pageable);
    Optional<CellTower> getCellTowerById(Long id);
    Optional<CellTower> getCellTowerByCellId(Integer cellId);
    
    // Update
    CellTower updateCellTower(Long id, CellTower cellTower);
    CellTower partialUpdateCellTower(Long id, CellTower cellTower);
    
    // Delete
    void deleteCellTower(Long id);
    void deleteAllCellTowers();
    
    // Custom queries
    List<CellTower> getCellTowersByRadio(String radio);
    Page<CellTower> getCellTowersByRadio(String radio, Pageable pageable);
    
    List<CellTower> getCellTowersByMcc(Integer mcc);
    Page<CellTower> getCellTowersByMcc(Integer mcc, Pageable pageable);
    
    List<CellTower> getCellTowersByRadioAndMcc(String radio, Integer mcc);
    
    List<CellTower> getCellTowersByLocation(Double minLon, Double maxLon, Double minLat, Double maxLat);
    
    List<CellTower> getCellTowersWithHighSamples(Integer minSamples);
    
    List<CellTower> getCellTowersBySignalRange(Integer minSignal, Integer maxSignal);
    
    Long getCountByRadio(String radio);

    // FIXED: Use consistent method name and return type
    Long count();
}