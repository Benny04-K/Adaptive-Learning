package com.adaptive.learning.service;

import com.adaptive.learning.model.AvailableContentResponse;
import com.adaptive.learning.model.Component;
import com.adaptive.learning.model.Component.AssessmentMeta;
import com.adaptive.learning.model.Component.Metadata;
import com.adaptive.learning.model.Component.UnitMeta;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Holds all available draggable components.
 * Seeded on startup — mirrors available-content.example.json
 */
@Service
public class ComponentService {

    private final List<Component> components = new ArrayList<>();

    @PostConstruct
    public void seed() {
        // ── Assessments ───────────────────────────────────────────────────────
        components.add(new Component(
                "cmp-assess-math-1",
                "Math Module 1 Assessment",
                "Baseline math diagnostic used to route learners.",
                "assessment", 35,
                new Metadata(new AssessmentMeta(100, 50))
        ));

        components.add(new Component(
                "cmp-assess-reading-1",
                "Reading & Comp Module 1",
                "Reading comprehension and vocabulary baseline.",
                "assessment", 32,
                new Metadata(new AssessmentMeta(100, 55))
        ));

        components.add(new Component(
                "cmp-assess-writing-1",
                "Writing Module Assessment",
                "Essay and grammar diagnostic for writing placement.",
                "assessment", 40,
                new Metadata(new AssessmentMeta(100, 60))
        ));

        // ── Units ─────────────────────────────────────────────────────────────
        components.add(new Component(
                "cmp-unit-math-2-easy",
                "Math Module 2 – Easy",
                "Foundational math remediation unit for lower scorers.",
                "unit", 35,
                new Metadata(new UnitMeta(30))
        ));

        components.add(new Component(
                "cmp-unit-math-2-advanced",
                "Math Module 2 – Advanced",
                "Accelerated math content for higher performers.",
                "unit", 35,
                new Metadata(new UnitMeta(30))
        ));

        components.add(new Component(
                "cmp-unit-rc-easy",
                "R&C Module 2 – Easy",
                "Foundational reading comprehension support unit.",
                "unit", 32,
                new Metadata(new UnitMeta(28))
        ));

        components.add(new Component(
                "cmp-unit-rc-advanced",
                "R&C Module 2 – Advanced",
                "Advanced reading analysis and inference unit.",
                "unit", 32,
                new Metadata(new UnitMeta(28))
        ));

        components.add(new Component(
                "cmp-unit-vocab",
                "Vocabulary Builder",
                "Core vocabulary expansion for SAT word lists.",
                "unit", 20,
                new Metadata(new UnitMeta(18))
        ));
    }

    public AvailableContentResponse getAll() {
        return new AvailableContentResponse(components);
    }
}
