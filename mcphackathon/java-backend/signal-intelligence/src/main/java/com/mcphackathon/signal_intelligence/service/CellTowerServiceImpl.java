package com.mcphackathon.signal_intelligence.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mcphackathon.signal_intelligence.entity.CellTower;
import com.mcphackathon.signal_intelligence.repository.CellTowerRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CellTowerServiceImpl implements CellTowerService {
    
    @Autowired
    private CellTowerRepository cellTowerRepository;
    
    @Override
    public CellTower createCellTower(CellTower cellTower) {
        return cellTowerRepository.save(cellTower);
    }
    
    @Override
    public List<CellTower> createMultipleCellTowers(List<CellTower> cellTowers) {
        return cellTowerRepository.saveAll(cellTowers);
    }
    
    @Override
    public void saveAll(List<CellTower> cellTowers) {
        cellTowerRepository.saveAll(cellTowers);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CellTower> getAllCellTowers() {
        return cellTowerRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<CellTower> getAllCellTowers(Pageable pageable) {
        return cellTowerRepository.findAll(pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<CellTower> getCellTowerById(Long id) {
        return cellTowerRepository.findById(id);
    }
    
   
    
    @Override
    public CellTower updateCellTower(Long id, CellTower cellTower) {
        if (!cellTowerRepository.existsById(id)) {
            throw new RuntimeException("CellTower not found with id: " + id);
        }
        cellTower.setId(id);
        return cellTowerRepository.save(cellTower);
    }
    
    @Override
    public CellTower partialUpdateCellTower(Long id, CellTower cellTower) {
        return cellTowerRepository.findById(id)
                .map(existingTower -> {
                    if (cellTower.getRadio() != null) {
                        existingTower.setRadio(cellTower.getRadio());
                    }
                    if (cellTower.getMcc() != null) {
                        existingTower.setMcc(cellTower.getMcc());
                    }
                    if (cellTower.getNet() != null) {
                        existingTower.setNet(cellTower.getNet());
                    }
                    if (cellTower.getArea() != null) {
                        existingTower.setArea(cellTower.getArea());
                    }
                    if (cellTower.getCell() != null) {
                        existingTower.setCell(cellTower.getCell());
                    }
                    if (cellTower.getUnit() != null) {
                        existingTower.setUnit(cellTower.getUnit());
                    }
                    if (cellTower.getLon() != null) {
                        existingTower.setLon(cellTower.getLon());
                    }
                    if (cellTower.getLat() != null) {
                        existingTower.setLat(cellTower.getLat());
                    }
                    if (cellTower.getRange() != null) {
                        existingTower.setRange(cellTower.getRange());
                    }
                    if (cellTower.getSamples() != null) {
                        existingTower.setSamples(cellTower.getSamples());
                    }
                    if (cellTower.getChangeable() != null) {
                        existingTower.setChangeable(cellTower.getChangeable());
                    }
                    if (cellTower.getCreated() != null) {
                        existingTower.setCreated(cellTower.getCreated());
                    }
                    if (cellTower.getUpdated() != null) {
                        existingTower.setUpdated(cellTower.getUpdated());
                    }
                    if (cellTower.getAverageSignal() != null) {
                        existingTower.setAverageSignal(cellTower.getAverageSignal());
                    }
                    return cellTowerRepository.save(existingTower);
                })
                .orElseThrow(() -> new RuntimeException("CellTower not found with id: " + id));
    }
    
    @Override
    public void deleteCellTower(Long id) {
        if (!cellTowerRepository.existsById(id)) {
            throw new RuntimeException("CellTower not found with id: " + id);
        }
        cellTowerRepository.deleteById(id);
    }
    
    @Override
    public void deleteAllCellTowers() {
        cellTowerRepository.deleteAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CellTower> getCellTowersByRadio(String radio) {
        return cellTowerRepository.findByRadio(radio);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<CellTower> getCellTowersByRadio(String radio, Pageable pageable) {
        return cellTowerRepository.findByRadio(radio, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CellTower> getCellTowersByMcc(Integer mcc) {
        return cellTowerRepository.findByMcc(mcc);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<CellTower> getCellTowersByMcc(Integer mcc, Pageable pageable) {
        return cellTowerRepository.findByMcc(mcc, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CellTower> getCellTowersByRadioAndMcc(String radio, Integer mcc) {
        return cellTowerRepository.findByRadioAndMcc(radio, mcc);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CellTower> getCellTowersByLocation(Double minLon, Double maxLon, Double minLat, Double maxLat) {
        return cellTowerRepository.findByLocationWithinBounds(minLon, maxLon, minLat, maxLat);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CellTower> getCellTowersWithHighSamples(Integer minSamples) {
        return cellTowerRepository.findBySamplesGreaterThan(minSamples);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CellTower> getCellTowersBySignalRange(Integer minSignal, Integer maxSignal) {
        return cellTowerRepository.findByAverageSignalBetween(minSignal, maxSignal);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Long getCountByRadio(String radio) {
        return cellTowerRepository.countByRadio(radio);
    }
    
    // FIXED: Use Long return type to match interface
    @Override
    @Transactional(readOnly = true)
    public Long count() {
        Long count = cellTowerRepository.count();
        System.out.println("Total cell tower records count: " + count);
        return count;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CellTower> getCellTowerByCellId(Integer cellId) {
        return cellTowerRepository.findByCell(cellId).stream().findFirst();
    }
   
}