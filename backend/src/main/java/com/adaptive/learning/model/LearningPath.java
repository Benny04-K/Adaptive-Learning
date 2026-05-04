package com.adaptive.learning.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

/**
 * A complete saved learning path.
 * Mirrors learning-path.schema.json top-level shape.
 *
 * Used as:
 *   POST /api/learning-paths         → request body
 *   GET  /api/learning-paths/{id}    → response body
 *   GET  /api/learning-paths         → list item
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LearningPath {

    private String      id;
    private String      name;
    private String      description;
    private String      status;      // "draft" | "published"
    private Integer     version;
    private CanvasState canvas;
    private List<Node>  nodes;
    private List<Edge>  edges;

    public LearningPath() {}

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getId()                        { return id; }
    public void   setId(String id)               { this.id = id; }

    public String getName()                      { return name; }
    public void   setName(String name)           { this.name = name; }

    public String getDescription()               { return description; }
    public void   setDescription(String d)       { this.description = d; }

    public String getStatus()                    { return status; }
    public void   setStatus(String status)       { this.status = status; }

    public Integer getVersion()                  { return version; }
    public void    setVersion(Integer version)   { this.version = version; }

    public CanvasState getCanvas()               { return canvas; }
    public void        setCanvas(CanvasState c)  { this.canvas = c; }

    public List<Node> getNodes()                 { return nodes; }
    public void       setNodes(List<Node> nodes) { this.nodes = nodes; }

    public List<Edge> getEdges()                 { return edges; }
    public void       setEdges(List<Edge> edges) { this.edges = edges; }
}
