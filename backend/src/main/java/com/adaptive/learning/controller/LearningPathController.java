package com.adaptive.learning.controller;

import com.adaptive.learning.model.ErrorResponse;
import com.adaptive.learning.model.LearningPath;
import com.adaptive.learning.service.LearningPathService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST endpoints for learning paths.
 *
 *   POST   /api/learning-paths          → save a new path (201 Created)
 *   GET    /api/learning-paths          → list all saved paths
 *   GET    /api/learning-paths/{id}     → load one path by id
 *   PUT    /api/learning-paths/{id}     → update an existing path
 *   DELETE /api/learning-paths/{id}     → delete a path
 */
@RestController
@RequestMapping("/api/learning-paths")
public class LearningPathController {

    @Autowired
    private LearningPathService learningPathService;

    // ── POST /api/learning-paths ──────────────────────────────────────────────

    /**
     * Save a learning path built in the canvas.
     * Request body must match learning-path.schema.json
     * Returns 201 Created with the saved path (including generated id).
     */
    @PostMapping
    public ResponseEntity<LearningPath> create(@RequestBody LearningPath learningPath) {
        LearningPath saved = learningPathService.save(learningPath);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ── GET /api/learning-paths ───────────────────────────────────────────────

    /**
     * List all saved learning paths.
     * Returns an array — most recently saved first.
     */
    @GetMapping
    public ResponseEntity<List<LearningPath>> getAll() {
        return ResponseEntity.ok(learningPathService.findAll());
    }

    // ── GET /api/learning-paths/{id} ──────────────────────────────────────────

    /**
     * Load a previously saved learning path by id.
     * Returns 404 with an error body when the id is not found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        Optional<LearningPath> found = learningPathService.findById(id);

        if (found.isEmpty()) {
            ErrorResponse error = new ErrorResponse(
                    404,
                    "Not Found",
                    "Learning path with id '" + id + "' does not exist."
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        return ResponseEntity.ok(found.get());
    }

    // ── PUT /api/learning-paths/{id} ──────────────────────────────────────────

    /**
     * Update an existing learning path.
     * The id in the path parameter is applied to the body before saving.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id,
                                    @RequestBody LearningPath learningPath) {
        if (learningPathService.findById(id).isEmpty()) {
            ErrorResponse error = new ErrorResponse(
                    404,
                    "Not Found",
                    "Learning path with id '" + id + "' does not exist."
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        learningPath.setId(id);
        LearningPath updated = learningPathService.save(learningPath);
        return ResponseEntity.ok(updated);
    }

    // ── DELETE /api/learning-paths/{id} ───────────────────────────────────────

    /**
     * Delete a saved learning path.
     * Returns 204 No Content on success, 404 when not found.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        boolean deleted = learningPathService.deleteById(id);

        if (!deleted) {
            ErrorResponse error = new ErrorResponse(
                    404,
                    "Not Found",
                    "Learning path with id '" + id + "' does not exist."
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        return ResponseEntity.noContent().build();
    }
}
