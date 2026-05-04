package com.adaptive.learning.model;

/**
 * X/Y canvas coordinates for a node.
 */
public class Position {

    private double x;
    private double y;

    public Position() {}

    public Position(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public double getX()         { return x; }
    public void   setX(double x) { this.x = x; }

    public double getY()         { return y; }
    public void   setY(double y) { this.y = y; }
}
