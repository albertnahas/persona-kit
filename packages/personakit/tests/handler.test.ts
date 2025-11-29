import { describe, it, expect } from "vitest";
import {
  createErrorResponse,
  createJsonResponse,
} from "../src/server/requestParser.js";

describe("createErrorResponse", () => {
  it("should create error response with default status", async () => {
    const response = createErrorResponse("Something went wrong");
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error).toBe("Something went wrong");
  });

  it("should create error response with custom status", async () => {
    const response = createErrorResponse("Not found", 404);
    expect(response.status).toBe(404);
  });

  it("should set correct content type", () => {
    const response = createErrorResponse("Error");
    expect(response.headers.get("Content-Type")).toBe("application/json");
  });
});

describe("createJsonResponse", () => {
  it("should create JSON response", async () => {
    const data = { message: "Hello", count: 42 };
    const response = createJsonResponse(data);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(data);
  });

  it("should handle custom status", async () => {
    const response = createJsonResponse({ created: true }, 201);
    expect(response.status).toBe(201);
  });
});

// Note: Full handler tests require mocking the AI SDK
// which is better done in integration tests
describe("handler integration", () => {
  it.skip("should handle chat request", async () => {
    // Integration test placeholder
    // Requires OPENAI_API_KEY and mocking
  });
});
