package com.adaptive.learning.model;

import java.util.ArrayList;
import java.util.List;

/**
 * The conditions block on an edge.
 * operator = "AND" | "OR"
 * rules    = list of ConditionRule
 */
public class EdgeConditions {

    private String              operator = "AND";
    private List<ConditionRule> rules    = new ArrayList<>();

    public EdgeConditions() {}

    public String              getOperator()                       { return operator; }
    public void                setOperator(String operator)        { this.operator = operator; }

    public List<ConditionRule> getRules()                         { return rules; }
    public void                setRules(List<ConditionRule> rules) { this.rules = rules; }
}
