package com.example.stepcounter.service;

import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class StepService {
    private final AtomicInteger total = new AtomicInteger(0);

    public int addSteps(int steps) {
        if (steps <= 0) return total.get();
        return total.addAndGet(steps);
    }

    public int getTotal() {
        return total.get();
    }

    public void reset() {
        total.set(0);
    }
}
