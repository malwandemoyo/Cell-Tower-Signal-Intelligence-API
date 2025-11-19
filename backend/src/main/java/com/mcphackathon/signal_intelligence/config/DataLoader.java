package com.mcphackathon.signal_intelligence.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.mcphackathon.signal_intelligence.entity.CellTower;
import com.mcphackathon.signal_intelligence.service.CellTowerService;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {
    
    @Autowired
    private CellTowerService cellTowerService;
    
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    @Override
    public void run(String... args) throws Exception {
        
        String filePath = "src/main/resources/655.csv";
        System.out.println("Loading cell tower data from: " + filePath);
        
        // Check if data already exists to avoid duplicates
        Long existingCount = cellTowerService.count();
        if (existingCount > 0) {
            System.out.println("Database already contains " + existingCount + " records. Skipping data load.");
            return;
        }
        
        List<CellTower> cellTowers = parseCsvData(filePath);
        
        if (!cellTowers.isEmpty()) {
            System.out.println("Found " + cellTowers.size() + " cell tower records");
            
            cellTowerService.saveAll(cellTowers);
            System.out.println("Successfully loaded " + cellTowers.size() + " cell tower records into database");
        } else {
            System.out.println("No cell tower records found to load");
        }
    }
    
    private List<CellTower> parseCsvData(String filePath) {
        List<CellTower> cellTowers = new ArrayList<>();
        try {
            List<String> lines = Files.readAllLines(Paths.get(filePath));
            
            for (int i = 0; i < lines.size(); i++) {
                String line = lines.get(i);
                String[] data = line.split(",");
                
                if (data.length >= 14) {
                    CellTower tower = new CellTower();
                    tower.setRadio(data[0]);
                    tower.setMcc(parseInt(data[1]));
                    tower.setNet(parseInt(data[2]));
                    tower.setArea(parseInt(data[3]));
                    tower.setCell(parseInt(data[4]));
                    tower.setUnit(parseInt(data[5]));
                    
                    tower.setLon(parseDouble(data[6]));
                    tower.setLat(parseDouble(data[7]));
                    
                    tower.setRange(parseInt(data[8]));
                    tower.setSamples(parseInt(data[9]));
                    tower.setChangeable(parseInt(data[10]));
                    
                    tower.setCreated(parseUnixTimestamp(data[11]));
                    tower.setUpdated(parseUnixTimestamp(data[12]));
                    
                    tower.setAverageSignal(parseInt(data[13]));
                    
                    cellTowers.add(tower);
                } else {
                    System.out.println("Skipping invalid line " + i + ": " + line);
                }
            }
        } catch (Exception e) {
            System.err.println("Error parsing CSV file: " + e.getMessage());
            e.printStackTrace();
        }
        return cellTowers;
    }
    
    private Integer parseInt(String value) {
        try {
            return value != null && !value.trim().isEmpty() ? Integer.parseInt(value.trim()) : null;
        } catch (NumberFormatException e) {
            System.err.println("Error parsing integer: " + value);
            return null;
        }
    }
    
    private Double parseDouble(String value) {
        try {
            return value != null && !value.trim().isEmpty() ? Double.parseDouble(value.trim()) : null;
        } catch (NumberFormatException e) {
            System.err.println("Error parsing double: " + value);
            return null;
        }
    }
    
    private LocalDateTime parseUnixTimestamp(String value) {
        try {
            if (value != null && !value.trim().isEmpty()) {
                long unixTimestamp = Long.parseLong(value.trim());
                return LocalDateTime.ofEpochSecond(unixTimestamp, 0, java.time.ZoneOffset.UTC);
            }
            return null;
        } catch (Exception e) {
            System.err.println("Error parsing timestamp: " + value);
            return null;
        }
    }
    
    private LocalDateTime parseDateTime(String value) {
        try {
            return value != null && !value.trim().isEmpty() ? 
                LocalDateTime.parse(value.trim(), formatter) : null;
        } catch (Exception e) {
            System.err.println("Error parsing date: " + value);
            return null;
        }
    }
}