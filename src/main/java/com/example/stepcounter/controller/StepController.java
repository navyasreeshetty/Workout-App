package com.example.stepcounter.controller;

import com.example.stepcounter.service.StepService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/steps")
public class StepController {
    private final StepService service;

    public StepController(StepService service) {
        this.service = service;
    }

    @GetMapping
    public Map<String, Integer> getTotal() {
        Map<String, Integer> response = new HashMap<>();
        response.put("total", service.getTotal());
        return response;
    }

    @PostMapping
    public Map<String, Integer> addSteps(@RequestBody Map<String, Integer> body) {
        int count = body.getOrDefault("count", 0);
        int total = service.addSteps(count);
        Map<String, Integer> response = new HashMap<>();
        response.put("total", total);
        return response;
    }

    @PostMapping("/reset")
    public Map<String, String> reset() {
        service.reset();
        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        return response;
    }
}
