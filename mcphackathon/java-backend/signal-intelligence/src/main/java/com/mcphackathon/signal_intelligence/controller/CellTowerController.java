package com.mcphackathon.signal_intelligence.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mcphackathon.signal_intelligence.entity.CellTower;
import com.mcphackathon.signal_intelligence.service.CellTowerService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cell-towers")
@CrossOrigin(origins = "*")
public class CellTowerController {
    
    @Autowired
    private CellTowerService cellTowerService;
    
    // CREATE endpoints
    @PostMapping
    public ResponseEntity<CellTower> createCellTower(@RequestBody CellTower cellTower) {
        try {
            CellTower created = cellTowerService.createCellTower(cellTower);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping("/batch")
    public ResponseEntity<List<CellTower>> createMultipleCellTowers(@RequestBody List<CellTower> cellTowers) {
        try {
            List<CellTower> created = cellTowerService.createMultipleCellTowers(cellTowers);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ endpoints
    @GetMapping
    public ResponseEntity<List<CellTower>> getAllCellTowers() {
        try {
            List<CellTower> cellTowers = cellTowerService.getAllCellTowers();
            if (cellTowers.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(cellTowers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/paged")
    public ResponseEntity<Page<CellTower>> getAllCellTowersPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        try {
            Sort sort = sortDirection.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<CellTower> cellTowers = cellTowerService.getAllCellTowers(pageable);
            return new ResponseEntity<>(cellTowers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CellTower> getCellTowerById(@PathVariable Long id) {
        Optional<CellTower> cellTower = cellTowerService.getCellTowerById(id);
        return cellTower.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @GetMapping("/cell/{cellId}")
    public ResponseEntity<List<CellTower>> getCellTowerByCellId(@PathVariable Integer cellId) {
        Optional<CellTower> cellTower = cellTowerService.getCellTowerByCellId(cellId);
        if (cellTower.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(List.of(cellTower.get()), HttpStatus.OK);
    }


    // UPDATE endpoints
    @PutMapping("/{id}")
    public ResponseEntity<CellTower> updateCellTower(@PathVariable Long id, @RequestBody CellTower cellTower) {
        try {
            CellTower updated = cellTowerService.updateCellTower(id, cellTower);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<CellTower> partialUpdateCellTower(@PathVariable Long id, @RequestBody CellTower cellTower) {
        try {
            CellTower updated = cellTowerService.partialUpdateCellTower(id, cellTower);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // DELETE endpoints
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteCellTower(@PathVariable Long id) {
        try {
            cellTowerService.deleteCellTower(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @DeleteMapping
    public ResponseEntity<HttpStatus> deleteAllCellTowers() {
        try {
            cellTowerService.deleteAllCellTowers();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Custom query endpoints
    @GetMapping("/radio/{radio}")
    public ResponseEntity<List<CellTower>> getCellTowersByRadio(@PathVariable String radio) {
        try {
            List<CellTower> cellTowers = cellTowerService.getCellTowersByRadio(radio);
            if (cellTowers.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(cellTowers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/radio/{radio}/paged")
    public ResponseEntity<Page<CellTower>> getCellTowersByRadioPaged(
            @PathVariable String radio,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<CellTower> cellTowers = cellTowerService.getCellTowersByRadio(radio, pageable);
            return new ResponseEntity<>(cellTowers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/mcc/{mcc}")
    public ResponseEntity<List<CellTower>> getCellTowersByMcc(@PathVariable Integer mcc) {
        try {
            List<CellTower> cellTowers = cellTowerService.getCellTowersByMcc(mcc);
            if (cellTowers.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(cellTowers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/radio/{radio}/mcc/{mcc}")
    public ResponseEntity<List<CellTower>> getCellTowersByRadioAndMcc(
            @PathVariable String radio, @PathVariable Integer mcc) {
        try {
            List<CellTower> cellTowers = cellTowerService.getCellTowersByRadioAndMcc(radio, mcc);
            if (cellTowers.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(cellTowers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/location")
    public ResponseEntity<List<CellTower>> getCellTowersByLocation(
            @RequestParam Double minLon,
            @RequestParam Double maxLon,
            @RequestParam Double minLat,
            @RequestParam Double maxLat) {
        
        try {
            List<CellTower> cellTowers = cellTowerService.getCellTowersByLocation(minLon, maxLon, minLat, maxLat);
            if (cellTowers.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(cellTowers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/samples/{minSamples}")
    public ResponseEntity<List<CellTower>> getCellTowersWithHighSamples(@PathVariable Integer minSamples) {
        try {
            List<CellTower> cellTowers = cellTowerService.getCellTowersWithHighSamples(minSamples);
            if (cellTowers.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(cellTowers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/signal")
    public ResponseEntity<List<CellTower>> getCellTowersBySignalRange(
            @RequestParam Integer minSignal,
            @RequestParam Integer maxSignal) {
        
        try {
            List<CellTower> cellTowers = cellTowerService.getCellTowersBySignalRange(minSignal, maxSignal);
            if (cellTowers.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(cellTowers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/radio/{radio}/count")
    public ResponseEntity<Long> getCountByRadio(@PathVariable String radio) {
        try {
            Long count = cellTowerService.getCountByRadio(radio);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
