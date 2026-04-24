package com.tourkey.backend.dto;

import java.util.List;

public record LoginResponse(String token, String type, Long userId, String username, Long companyId, List<String> roles) {}
