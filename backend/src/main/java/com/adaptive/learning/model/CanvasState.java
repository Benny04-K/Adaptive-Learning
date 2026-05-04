package com.adaptive.learning.model;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Canvas viewport state: zoom level and offsets.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CanvasState {

    private Double zoom;
    private Double offsetX;
    private Double offsetY;

    public CanvasState() {}

    public Double getZoom()              { return zoom; }
    public void   setZoom(Double zoom)   { this.zoom = zoom; }

    public Double getOffsetX()           { return offsetX; }
    public void   setOffsetX(Double x)   { this.offsetX = x; }

    public Double getOffsetY()           { return offsetY; }
    public void   setOffsetY(Double y)   { this.offsetY = y; }
}
