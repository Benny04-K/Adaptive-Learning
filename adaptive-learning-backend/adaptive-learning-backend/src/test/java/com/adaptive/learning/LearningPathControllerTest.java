package com.adaptive.learning;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class LearningPathControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // Minimal valid learning-path JSON body
    private static final String VALID_BODY = """
        {
          "name": "Test Path",
          "status": "draft",
          "nodes": [
            {
              "id": "node-start",
              "componentId": "system-start",
              "type": "start",
              "label": "Start",
              "position": { "x": 100, "y": 50 }
            },
            {
              "id": "node-end",
              "componentId": "system-end",
              "type": "end",
              "label": "End",
              "position": { "x": 100, "y": 400 }
            }
          ],
          "edges": [
            {
              "id": "edge-1",
              "sourceNodeId": "node-start",
              "targetNodeId": "node-end",
              "conditions": { "operator": "AND", "rules": [] }
            }
          ]
        }
        """;

    // ── POST /api/learning-paths ──────────────────────────────────────────────

    @Test
    void createPath_returns201() throws Exception {
        mockMvc.perform(post("/api/learning-paths")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_BODY))
                .andExpect(status().isCreated());
    }

    @Test
    void createPath_responseHasId() throws Exception {
        mockMvc.perform(post("/api/learning-paths")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isString())
                .andExpect(jsonPath("$.name").value("Test Path"))
                .andExpect(jsonPath("$.status").value("draft"));
    }

    @Test
    void createPath_responseHasNodesAndEdges() throws Exception {
        mockMvc.perform(post("/api/learning-paths")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nodes").isArray())
                .andExpect(jsonPath("$.edges").isArray())
                .andExpect(jsonPath("$.nodes.length()").value(2))
                .andExpect(jsonPath("$.edges.length()").value(1));
    }

    // ── GET /api/learning-paths ───────────────────────────────────────────────

    @Test
    void getAllPaths_returns200AndArray() throws Exception {
        mockMvc.perform(get("/api/learning-paths"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    // ── GET /api/learning-paths/{id} ─────────────────────────────────────────

    @Test
    void getById_returnsPath() throws Exception {
        // First save a path to get an id
        MvcResult result = mockMvc.perform(post("/api/learning-paths")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_BODY))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        // Extract id from response (simple string search)
        String id = responseBody.split("\"id\":\"")[1].split("\"")[0];

        // Now load it back
        mockMvc.perform(get("/api/learning-paths/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.name").value("Test Path"));
    }

    @Test
    void getById_returns404WhenNotFound() throws Exception {
        mockMvc.perform(get("/api/learning-paths/does-not-exist"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"));
    }

    // ── PUT /api/learning-paths/{id} ─────────────────────────────────────────

    @Test
    void updatePath_returns200() throws Exception {
        // Save first
        MvcResult result = mockMvc.perform(post("/api/learning-paths")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_BODY))
                .andReturn();
        String id = result.getResponse().getContentAsString()
                .split("\"id\":\"")[1].split("\"")[0];

        // Update with new name
        String updatedBody = VALID_BODY.replace("Test Path", "Updated Path");
        mockMvc.perform(put("/api/learning-paths/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Path"));
    }

    // ── DELETE /api/learning-paths/{id} ──────────────────────────────────────

    @Test
    void deletePath_returns204() throws Exception {
        // Save first
        MvcResult result = mockMvc.perform(post("/api/learning-paths")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_BODY))
                .andReturn();
        String id = result.getResponse().getContentAsString()
                .split("\"id\":\"")[1].split("\"")[0];

        // Delete
        mockMvc.perform(delete("/api/learning-paths/" + id))
                .andExpect(status().isNoContent());
    }

    @Test
    void deletePath_returns404WhenNotFound() throws Exception {
        mockMvc.perform(delete("/api/learning-paths/ghost-id"))
                .andExpect(status().isNotFound());
    }
}
