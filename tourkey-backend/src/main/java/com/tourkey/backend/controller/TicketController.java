package com.tourkey.backend.controller;

import com.tourkey.backend.dto.CreateTicketRequest;
import com.tourkey.backend.dto.TicketDto;
import com.tourkey.backend.service.TicketService;
import com.tourkey.backend.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<TicketDto> create(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody CreateTicketRequest request) {
        return ResponseEntity.ok(ticketService.createTicket(user.getCompanyId(), request));
    }

    @GetMapping("/my-sales")
    public ResponseEntity<List<TicketDto>> mySales(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(ticketService.getTicketsBySeller(user.getCompanyId()));
    }

    @GetMapping("/my-tours")
    public ResponseEntity<List<TicketDto>> myTours(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(ticketService.getTicketsByOrganizer(user.getCompanyId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicket(id));
    }
}
