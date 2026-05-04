package com.adaptive.learning;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ComponentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // ── GET /api/components ───────────────────────────────────────────────────

    @Test
    void getComponents_returns200() throws Exception {
        mockMvc.perform(get("/api/components"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void getComponents_hasItemsAndTotalCount() throws Exception {
        mockMvc.perform(get("/api/components"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.totalCount").isNumber());
    }

    @Test
    void getComponents_returns8Items() throws Exception {
        mockMvc.perform(get("/api/components"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCount").value(8))
                .andExpect(jsonPath("$.items.length()").value(8));
    }

    @Test
    void getComponents_firstItemHasRequiredFields() throws Exception {
        mockMvc.perform(get("/api/components"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].id").isString())
                .andExpect(jsonPath("$.items[0].title").isString())
                .andExpect(jsonPath("$.items[0].shortDescription").isString())
                .andExpect(jsonPath("$.items[0].type").isString())
                .andExpect(jsonPath("$.items[0].approximateDurationMinutes").isNumber());
    }

    @Test
    void getComponents_assessmentItemHasMetadata() throws Exception {
        mockMvc.perform(get("/api/components"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].metadata.assessment.maxScore").isNumber())
                .andExpect(jsonPath("$.items[0].metadata.assessment.passingScore").isNumber());
    }
}
