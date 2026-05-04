package com.adaptive.learning.controller;

import com.adaptive.learning.model.AvailableContentResponse;
import com.adaptive.learning.service.ComponentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * GET /api/components
 *
 * Returns all draggable content items for the left panel.
 * Response matches available-content.schema.json
 */
@RestController
@RequestMapping("/api")
public class ComponentController {

    @Autowired
    private ComponentService componentService;

    /**
     * GET /api/components
     * Response: { items: [...], totalCount: 8 }
     */
    @GetMapping("/components")
    public AvailableContentResponse getComponents() {
        return componentService.getAll();
    }
}
