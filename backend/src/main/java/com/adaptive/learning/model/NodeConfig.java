package com.adaptive.learning.model;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Optional per-node configuration: duration and assessment scoring.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NodeConfig {

    private Integer          approximateDurationMinutes;
    private AssessmentConfig assessment;

    public NodeConfig() {}

    public Integer getApproximateDurationMinutes()            { return approximateDurationMinutes; }
    public void    setApproximateDurationMinutes(Integer d)   { this.approximateDurationMinutes = d; }

    public AssessmentConfig getAssessment()                   { return assessment; }
    public void             setAssessment(AssessmentConfig a) { this.assessment = a; }

    // ── Nested ────────────────────────────────────────────────────────────────

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class AssessmentConfig {
        private int maxScore;
        private int passingScore;

        public AssessmentConfig() {}

        public int  getMaxScore()            { return maxScore; }
        public void setMaxScore(int s)       { this.maxScore = s; }

        public int  getPassingScore()        { return passingScore; }
        public void setPassingScore(int s)   { this.passingScore = s; }
    }
}
