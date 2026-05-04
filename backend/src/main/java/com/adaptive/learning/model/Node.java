package com.adaptive.learning.model;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * A canvas node: start | unit | assessment | end
 * Mirrors learning-path.schema.json → $defs/node
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Node {

    private String     id;
    private String     componentId;
    private String     type;          // "start" | "unit" | "assessment" | "end"
    private String     label;
    private String     description;
    private Position   position;
    private NodeConfig config;

    public Node() {}

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getId()                       { return id; }
    public void   setId(String id)             { this.id = id; }

    public String getComponentId()             { return componentId; }
    public void   setComponentId(String c)     { this.componentId = c; }

    public String getType()                    { return type; }
    public void   setType(String type)         { this.type = type; }

    public String getLabel()                   { return label; }
    public void   setLabel(String label)       { this.label = label; }

    public String getDescription()             { return description; }
    public void   setDescription(String d)     { this.description = d; }

    public Position getPosition()              { return position; }
    public void     setPosition(Position p)    { this.position = p; }

    public NodeConfig getConfig()              { return config; }
    public void       setConfig(NodeConfig c)  { this.config = c; }
}
