package com.tourkey.backend.entity;

import jakarta.persistence.*;
import org.locationtech.jts.geom.Point;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tours")
public class Tour extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", length = 2000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_company_id", nullable = false)
    private Company organizerCompany;

    @Column(name = "base_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "adult_price", precision = 15, scale = 2)
    private BigDecimal adultPrice;

    @Column(name = "child_price", precision = 15, scale = 2)
    private BigDecimal childPrice;

    @Column(name = "baby_price", precision = 15, scale = 2)
    private BigDecimal babyPrice;

    @Column(name = "guest_price", precision = 15, scale = 2)
    private BigDecimal guestPrice;

    @Column(name = "currency", nullable = false)
    private String currency = "TRY";

    @Column(name = "start_point", columnDefinition = "geometry(Point, 4326)")
    private Point startPoint;

    @Column(name = "end_point", columnDefinition = "geometry(Point, 4326)")
    private Point endPoint;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequence ASC")
    private List<RouteStop> routeStops = new ArrayList<>();

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourSchedule> schedules = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Company getOrganizerCompany() { return organizerCompany; }
    public void setOrganizerCompany(Company organizerCompany) { this.organizerCompany = organizerCompany; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public BigDecimal getAdultPrice() { return adultPrice; }
    public void setAdultPrice(BigDecimal adultPrice) { this.adultPrice = adultPrice; }

    public BigDecimal getChildPrice() { return childPrice; }
    public void setChildPrice(BigDecimal childPrice) { this.childPrice = childPrice; }

    public BigDecimal getBabyPrice() { return babyPrice; }
    public void setBabyPrice(BigDecimal babyPrice) { this.babyPrice = babyPrice; }

    public BigDecimal getGuestPrice() { return guestPrice; }
    public void setGuestPrice(BigDecimal guestPrice) { this.guestPrice = guestPrice; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Point getStartPoint() { return startPoint; }
    public void setStartPoint(Point startPoint) { this.startPoint = startPoint; }

    public Point getEndPoint() { return endPoint; }
    public void setEndPoint(Point endPoint) { this.endPoint = endPoint; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public List<RouteStop> getRouteStops() { return routeStops; }
    public void setRouteStops(List<RouteStop> routeStops) { this.routeStops = routeStops; }

    public List<TourSchedule> getSchedules() { return schedules; }
    public void setSchedules(List<TourSchedule> schedules) { this.schedules = schedules; }
}
