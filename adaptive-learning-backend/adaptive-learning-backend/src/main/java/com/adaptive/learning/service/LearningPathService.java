package com.adaptive.learning.service;

import com.adaptive.learning.model.LearningPath;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * In-memory store for learning paths.
 * Uses a HashMap — data lives for the lifetime of the running server.
 * Swap out for a database layer (JPA / MongoDB) when needed.
 */
@Service
public class LearningPathService {

    // id → LearningPath  (our "database")
    private final Map<String, LearningPath> store = new LinkedHashMap<>();

    // ── Create / Update ───────────────────────────────────────────────────────

    /**
     * Save a learning path.
     * If no id is present we generate one.
     * If the id already exists the path is overwritten (update).
     */
    public LearningPath save(LearningPath learningPath) {
        if (learningPath.getId() == null || learningPath.getId().isBlank()) {
            learningPath.setId(generateId());
        }
        if (learningPath.getVersion() == null) {
            learningPath.setVersion(1);
        }
        store.put(learningPath.getId(), learningPath);
        return learningPath;
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    /**
     * Find a single learning path by id.
     * Returns empty Optional when not found (controller turns this into 404).
     */
    public Optional<LearningPath> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    /**
     * Return all saved learning paths, most-recently-saved first.
     */
    public List<LearningPath> findAll() {
        List<LearningPath> all = new ArrayList<>(store.values());
        Collections.reverse(all);
        return all;
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    /**
     * Delete by id.
     * Returns true when something was actually deleted.
     */
    public boolean deleteById(String id) {
        return store.remove(id) != null;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String generateId() {
        return "lp-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }
}
