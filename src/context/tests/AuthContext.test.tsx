import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { AuthProvider, useAuth } from "../AuthContext";
import { authService } from "../../services/authService";

vi.mock("../../services/authService", () => ({
  authService: {
    logout: vi.fn(),
    sendOtp: vi.fn(),
    verifyOtp: vi.fn(),
  },
}));
const TestComponent = () => {
  const { isAuthenticated, userId, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? "authenticated" : "not authenticated"}
      </div>
      <div data-testid="user-id">{userId || "no user"}</div>
      <button onClick={() => login("token", "1234567890", "user1")}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.mocked(authService.logout).mockResolvedValue(undefined);
  });
  it("provides initial unauthenticated state", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "not authenticated",
      );
      expect(screen.getByTestId("user-id")).toHaveTextContent("no user");
    });
  });

  it("authenticates user on login", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    screen.getByText("Login").click();

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "authenticated",
      );
      expect(screen.getByTestId("user-id")).toHaveTextContent("user1");
    });
  });

  it("restores session from sessionStorage", async () => {
    sessionStorage.setItem("authToken", "token");
    sessionStorage.setItem("phoneNumber", "1234567890");
    sessionStorage.setItem("userId", "user1");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "authenticated",
      );
      expect(screen.getByTestId("user-id")).toHaveTextContent("user1");
    });
  });

  it("logs out user and clears session", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // Login first
    screen.getByText("Login").click();
    await waitFor(
      () => screen.getByTestId("auth-status").textContent === "authenticated",
    );

    // Then logout
    screen.getByText("Logout").click();

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "not authenticated",
      );
      expect(sessionStorage.getItem("authToken")).toBeNull();
    });
  });

  it("throws error when useAuth used outside provider", () => {
    expect(() => render(<TestComponent />)).toThrow(
      "useAuth must be used within AuthProvider",
    );
  });
});
