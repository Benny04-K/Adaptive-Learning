package com.adaptive.learning.model;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Represents a draggable content item shown in the left panel.
 * Mirrors available-content.schema.json → component definition.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Component {

    private String   id;
    private String   title;
    private String   shortDescription;
    private String   type;                       // "unit" | "assessment"
    private int      approximateDurationMinutes;
    private Metadata metadata;

    public Component() {}

    public Component(String id, String title, String shortDescription,
                     String type, int approximateDurationMinutes, Metadata metadata) {
        this.id                         = id;
        this.title                      = title;
        this.shortDescription           = shortDescription;
        this.type                       = type;
        this.approximateDurationMinutes = approximateDurationMinutes;
        this.metadata                   = metadata;
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getId()                               { return id; }
    public void   setId(String id)                     { this.id = id; }

    public String getTitle()                           { return title; }
    public void   setTitle(String title)               { this.title = title; }

    public String getShortDescription()                { return shortDescription; }
    public void   setShortDescription(String s)        { this.shortDescription = s; }

    public String getType()                            { return type; }
    public void   setType(String type)                 { this.type = type; }

    public int  getApproximateDurationMinutes()        { return approximateDurationMinutes; }
    public void setApproximateDurationMinutes(int d)   { this.approximateDurationMinutes = d; }

    public Metadata getMetadata()                      { return metadata; }
    public void     setMetadata(Metadata m)            { this.metadata = m; }

    // ── Nested: Metadata ─────────────────────────────────────────────────────

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Metadata {
        private AssessmentMeta assessment;
        private UnitMeta       unit;

        public Metadata() {}
        public Metadata(AssessmentMeta a)  { this.assessment = a; }
        public Metadata(UnitMeta u)        { this.unit = u; }

        public AssessmentMeta getAssessment()                  { return assessment; }
        public void           setAssessment(AssessmentMeta a)  { this.assessment = a; }

        public UnitMeta getUnit()                              { return unit; }
        public void     setUnit(UnitMeta u)                    { this.unit = u; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class AssessmentMeta {
        private int maxScore;
        private int passingScore;

        public AssessmentMeta() {}
        public AssessmentMeta(int maxScore, int passingScore) {
            this.maxScore     = maxScore;
            this.passingScore = passingScore;
        }

        public int  getMaxScore()            { return maxScore; }
        public void setMaxScore(int s)       { this.maxScore = s; }

        public int  getPassingScore()        { return passingScore; }
        public void setPassingScore(int s)   { this.passingScore = s; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class UnitMeta {
        private int recommendedMinutes;

        public UnitMeta() {}
        public UnitMeta(int m) { this.recommendedMinutes = m; }

        public int  getRecommendedMinutes()        { return recommendedMinutes; }
        public void setRecommendedMinutes(int m)   { this.recommendedMinutes = m; }
    }
}
