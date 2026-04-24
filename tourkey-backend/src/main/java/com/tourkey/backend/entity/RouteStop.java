package com.tourkey.backend.entity;

import jakarta.persistence.*;
import org.locationtech.jts.geom.Point;

import java.time.LocalTime;

@Entity
@Table(name = "route_stops")
public class RouteStop extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "sequence", nullable = false)
    private Integer sequence;

    @Column(name = "location", columnDefinition = "geometry(Point, 4326)")
    private Point location;

    @Column(name = "arrival_time")
    private LocalTime arrivalTime;

    @Column(name = "departure_time")
    private LocalTime departureTime;

    @Column(name = "stop_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private StopType stopType = StopType.PICKUP;

    public enum StopType {
        PICKUP, DROPOFF, VISIT
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Tour getTour() { return tour; }
    public void setTour(Tour tour) { this.tour = tour; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getSequence() { return sequence; }
    public void setSequence(Integer sequence) { this.sequence = sequence; }

    public Point getLocation() { return location; }
    public void setLocation(Point location) { this.location = location; }

    public LocalTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; }

    public LocalTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }

    public StopType getStopType() { return stopType; }
    public void setStopType(StopType stopType) { this.stopType = stopType; }
}
