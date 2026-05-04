package com.adaptive.learning.model;

/**
 * Standard error response body returned on 4xx / 5xx.
 */
public class ErrorResponse {

    private int    status;
    private String error;
    private String message;

    public ErrorResponse() {}

    public ErrorResponse(int status, String error, String message) {
        this.status  = status;
        this.error   = error;
        this.message = message;
    }

    public int    getStatus()              { return status; }
    public void   setStatus(int status)    { this.status = status; }

    public String getError()               { return error; }
    public void   setError(String error)   { this.error = error; }

    public String getMessage()             { return message; }
    public void   setMessage(String msg)   { this.message = msg; }
}
