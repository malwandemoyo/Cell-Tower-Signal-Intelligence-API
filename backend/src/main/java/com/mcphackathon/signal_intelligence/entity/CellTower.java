package com.mcphackathon.signal_intelligence.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cell_tower")
public class CellTower {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "radio")
    private String radio;
    
    @Column(name = "mcc")
    private Integer mcc;
    
    @Column(name = "net")
    private Integer net;
    
    @Column(name = "area")
    private Integer area;
    
    @Column(name = "cell")
    private Integer cell;
    
    @Column(name = "unit")
    private Integer unit;
    
    @Column(name = "lon")
    private Double lon;  // Changed from longitude
    
    @Column(name = "lat")
    private Double lat;  // Changed from latitude
    
    @Column(name = "range")
    private Integer range;
    
    @Column(name = "samples")
    private Integer samples;
    
    @Column(name = "changeable")
    private Integer changeable;
    
    @Column(name = "created")
    private LocalDateTime created;
    
    @Column(name = "updated")
    private LocalDateTime updated;
    
    @Column(name = "average_signal")
    private Integer averageSignal;
    
    // Constructors
    public CellTower() {}
    
    public CellTower(String radio, Integer mcc, Integer net, Integer area, Integer cell, 
                    Integer unit, Double lon, Double lat, Integer range, 
                    Integer samples, Integer changeable, LocalDateTime created, 
                    LocalDateTime updated, Integer averageSignal) {
        this.radio = radio;
        this.mcc = mcc;
        this.net = net;
        this.area = area;
        this.cell = cell;
        this.unit = unit;
        this.lon = lon;
        this.lat = lat;
        this.range = range;
        this.samples = samples;
        this.changeable = changeable;
        this.created = created;
        this.updated = updated;
        this.averageSignal = averageSignal;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getRadio() { return radio; }
    public void setRadio(String radio) { this.radio = radio; }
    
    public Integer getMcc() { return mcc; }
    public void setMcc(Integer mcc) { this.mcc = mcc; }
    
    public Integer getNet() { return net; }
    public void setNet(Integer net) { this.net = net; }
    
    public Integer getArea() { return area; }
    public void setArea(Integer area) { this.area = area; }
    
    public Integer getCell() { return cell; }
    public void setCell(Integer cell) { this.cell = cell; }
    
    public Integer getUnit() { return unit; }
    public void setUnit(Integer unit) { this.unit = unit; }
    
    public Double getLon() { return lon; }
    public void setLon(Double lon) { this.lon = lon; }
    
    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }
    
    public Integer getRange() { return range; }
    public void setRange(Integer range) { this.range = range; }
    
    public Integer getSamples() { return samples; }
    public void setSamples(Integer samples) { this.samples = samples; }
    
    public Integer getChangeable() { return changeable; }
    public void setChangeable(Integer changeable) { this.changeable = changeable; }
    
    public LocalDateTime getCreated() { return created; }
    public void setCreated(LocalDateTime created) { this.created = created; }
    
    public LocalDateTime getUpdated() { return updated; }
    public void setUpdated(LocalDateTime updated) { this.updated = updated; }
    
    public Integer getAverageSignal() { return averageSignal; }
    public void setAverageSignal(Integer averageSignal) { this.averageSignal = averageSignal; }
}