package com.adaptive.learning.model;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * A single progression rule on an edge.
 * Mirrors learning-path.schema.json → $defs/rule
 *
 * Examples:
 *   { metric: "passed",      operator: "eq",      value: true  }
 *   { metric: "score",       operator: "gte",     value: 70    }
 *   { metric: "score_range", operator: "between", range: {min:0, max:49} }
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConditionRule {

    private String sourceType;    // "assessment" | "unit"
    private String sourceNodeId;
    private String id;
    private String metric;        // completion | passed | score | score_range | time_spent_minutes | percentage_completion
    private String operator;      // eq | ne | gt | gte | lt | lte | between
    private Object value;         // Boolean or Number — null when operator=between
    private Range  range;         // used when operator=between or metric=score_range

    public ConditionRule() {}

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getId()                        { return id; }
    public void   setId(String id)               { this.id = id; }

    public String getSourceType()                { return sourceType; }
    public void   setSourceType(String s)        { this.sourceType = s; }

    public String getSourceNodeId()              { return sourceNodeId; }
    public void   setSourceNodeId(String s)      { this.sourceNodeId = s; }

    public String getMetric()                    { return metric; }
    public void   setMetric(String metric)       { this.metric = metric; }

    public String getOperator()                  { return operator; }
    public void   setOperator(String operator)   { this.operator = operator; }

    public Object getValue()                     { return value; }
    public void   setValue(Object value)         { this.value = value; }

    public Range  getRange()                     { return range; }
    public void   setRange(Range range)          { this.range = range; }

    // ── Nested: Range ────────────────────────────────────────────────────────

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Range {
        private double  min;
        private double  max;
        private Boolean minInclusive;
        private Boolean maxInclusive;

        public Range() {}

        public double  getMin()                    { return min; }
        public void    setMin(double min)          { this.min = min; }

        public double  getMax()                    { return max; }
        public void    setMax(double max)          { this.max = max; }

        public Boolean getMinInclusive()           { return minInclusive; }
        public void    setMinInclusive(Boolean b)  { this.minInclusive = b; }

        public Boolean getMaxInclusive()           { return maxInclusive; }
        public void    setMaxInclusive(Boolean b)  { this.maxInclusive = b; }
    }
}
