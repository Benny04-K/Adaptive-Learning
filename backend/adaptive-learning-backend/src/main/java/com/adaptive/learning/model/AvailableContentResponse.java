package com.adaptive.learning.model;

import java.util.List;

/**
 * Wrapper for GET /api/components response.
 * Matches available-content.schema.json top-level shape: { items, totalCount }
 */
public class AvailableContentResponse {

    private List<Component> items;
    private int             totalCount;

    public AvailableContentResponse() {}

    public AvailableContentResponse(List<Component> items) {
        this.items      = items;
        this.totalCount = (items != null) ? items.size() : 0;
    }

    public List<Component> getItems()       { return items; }
    public void setItems(List<Component> items) {
        this.items      = items;
        this.totalCount = (items != null) ? items.size() : 0;
    }

    public int  getTotalCount()             { return totalCount; }
    public void setTotalCount(int n)        { this.totalCount = n; }
}
