package com.adaptive.learning.model;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * A directed connection between two canvas nodes.
 * Mirrors learning-path.schema.json → $defs/edge
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Edge {

    private String         id;
    private String         sourceNodeId;
    private String         targetNodeId;
    private String         label;
    private Integer        priority;
    private Boolean        isDefault;
    private EdgeConditions conditions;

    public Edge() {}

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getId()                              { return id; }
    public void   setId(String id)                     { this.id = id; }

    public String getSourceNodeId()                    { return sourceNodeId; }
    public void   setSourceNodeId(String s)            { this.sourceNodeId = s; }

    public String getTargetNodeId()                    { return targetNodeId; }
    public void   setTargetNodeId(String t)            { this.targetNodeId = t; }

    public String  getLabel()                          { return label; }
    public void    setLabel(String label)              { this.label = label; }

    public Integer getPriority()                       { return priority; }
    public void    setPriority(Integer priority)       { this.priority = priority; }

    public Boolean getIsDefault()                      { return isDefault; }
    public void    setIsDefault(Boolean d)             { this.isDefault = d; }

    public EdgeConditions getConditions()              { return conditions; }
    public void           setConditions(EdgeConditions c) { this.conditions = c; }
}
