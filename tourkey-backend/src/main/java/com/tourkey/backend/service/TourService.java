package com.tourkey.backend.service;

import com.tourkey.backend.dto.*;
import com.tourkey.backend.entity.*;
import com.tourkey.backend.repository.*;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TourService {

    private final TourRepository tourRepository;
    private final CompanyRepository companyRepository;
    private final PartnershipRepository partnershipRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public TourService(TourRepository tourRepository, CompanyRepository companyRepository, PartnershipRepository partnershipRepository) {
        this.tourRepository = tourRepository;
        this.companyRepository = companyRepository;
        this.partnershipRepository = partnershipRepository;
    }

    @Transactional
    public TourDto createTour(Long companyId, TourDto dto) {
        Company company = companyRepository.findById(companyId).orElseThrow();
        Tour tour = new Tour();
        tour.setName(dto.name());
        tour.setDescription(dto.description());
        tour.setOrganizerCompany(company);
        tour.setBasePrice(dto.basePrice());
        tour.setAdultPrice(dto.adultPrice());
        tour.setChildPrice(dto.childPrice());
        tour.setBabyPrice(dto.babyPrice());
        tour.setGuestPrice(dto.guestPrice());
        tour.setCurrency(dto.currency());
        tour.setIsActive(true);
        tour.setTenantId(companyId);

        if (dto.startLat() != null && dto.startLng() != null) {
            tour.setStartPoint(geometryFactory.createPoint(new Coordinate(dto.startLng(), dto.startLat())));
        }
        if (dto.endLat() != null && dto.endLng() != null) {
            tour.setEndPoint(geometryFactory.createPoint(new Coordinate(dto.endLng(), dto.endLat())));
        }

        if (dto.routeStops() != null) {
            for (RouteStopDto rsDto : dto.routeStops()) {
                RouteStop rs = new RouteStop();
                rs.setName(rsDto.name());
                rs.setSequence(rsDto.sequence());
                if (rsDto.lat() != null && rsDto.lng() != null) {
                    rs.setLocation(geometryFactory.createPoint(new Coordinate(rsDto.lng(), rsDto.lat())));
                }
                rs.setArrivalTime(rsDto.arrivalTime() != null ? java.time.LocalTime.parse(rsDto.arrivalTime()) : null);
                rs.setDepartureTime(rsDto.departureTime() != null ? java.time.LocalTime.parse(rsDto.departureTime()) : null);
                rs.setStopType(RouteStop.StopType.valueOf(rsDto.stopType()));
                rs.setTour(tour);
                rs.setTenantId(companyId);
                tour.getRouteStops().add(rs);
            }
        }

        if (dto.schedules() != null) {
            for (TourScheduleDto schDto : dto.schedules()) {
                TourSchedule sch = new TourSchedule();
                sch.setScheduleDate(schDto.scheduleDate());
                sch.setDepartureTime(schDto.departureTime() != null ? java.time.LocalTime.parse(schDto.departureTime()) : null);
                sch.setStatus(TourSchedule.ScheduleStatus.OPEN);
                sch.setCapacity(schDto.capacity());
                sch.setSoldSeats(0);
                sch.setTour(tour);
                sch.setTenantId(companyId);
                tour.getSchedules().add(sch);
            }
        }

        Tour saved = tourRepository.save(tour);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<TourDto> getCompanyTours(Long companyId) {
        return tourRepository.findAllByOrganizerCompanyIdAndIsActiveTrue(companyId).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<TourDto> getAvailableToursForSale(Long sellerCompanyId) {
        var partners = partnershipRepository.findActivePartnershipsByCompanyId(sellerCompanyId);
        var partnerIds = partners.stream()
                .map(p -> p.getRequesterCompany().getId().equals(sellerCompanyId) ? p.getRecipientCompany().getId() : p.getRequesterCompany().getId())
                .toList();
        var all = tourRepository.findAllByOrganizerCompanyIdAndIsActiveTrue(sellerCompanyId);
        all.addAll(tourRepository.findAll().stream().filter(t -> partnerIds.contains(t.getOrganizerCompany().getId()) && Boolean.TRUE.equals(t.getIsActive())).toList());
        return all.stream().distinct().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public TourDto getTour(Long tourId) {
        return tourRepository.findById(tourId).map(this::toDto).orElseThrow();
    }

    private TourDto toDto(Tour t) {
        return new TourDto(
                t.getId(), t.getName(), t.getDescription(),
                t.getOrganizerCompany().getId(), t.getOrganizerCompany().getName(),
                t.getBasePrice(), t.getAdultPrice(), t.getChildPrice(), t.getBabyPrice(), t.getGuestPrice(),
                t.getCurrency(),
                t.getStartPoint() != null ? t.getStartPoint().getY() : null,
                t.getStartPoint() != null ? t.getStartPoint().getX() : null,
                t.getEndPoint() != null ? t.getEndPoint().getY() : null,
                t.getEndPoint() != null ? t.getEndPoint().getX() : null,
                t.getIsActive(),
                t.getRouteStops().stream().map(rs -> new RouteStopDto(
                        rs.getId(), rs.getName(), rs.getSequence(),
                        rs.getLocation() != null ? rs.getLocation().getY() : null,
                        rs.getLocation() != null ? rs.getLocation().getX() : null,
                        rs.getArrivalTime() != null ? rs.getArrivalTime().toString() : null,
                        rs.getDepartureTime() != null ? rs.getDepartureTime().toString() : null,
                        rs.getStopType().name()
                )).toList(),
                t.getSchedules().stream().map(s -> new TourScheduleDto(
                        s.getId(), s.getScheduleDate(),
                        s.getDepartureTime() != null ? s.getDepartureTime().toString() : null,
                        s.getStatus().name(), s.getCapacity(), s.getSoldSeats()
                )).toList()
        );
    }
}
