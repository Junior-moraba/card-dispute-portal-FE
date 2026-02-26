import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import Login from "./Login";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "../../utils/navigation";

vi.mock("../../context/AuthContext");
vi.mock("../../utils/navigation");

describe("Login", () => {
  const mockSendOtp = vi.fn();
  const mockVerifyOtp = vi.fn();
  const mockLogin = vi.fn();
  const mockGoHome = vi.fn();

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      sendOtp: mockSendOtp,
      verifyOtp: mockVerifyOtp,
      login: mockLogin,
      userId: null,
      isAuthenticated: false,
      phoneNumber: null,
      isLoading: false,
      logout: vi.fn(),
      refreshToken: vi.fn(),
    });
    vi.mocked(useNavigation).mockReturnValue({
      goHome: mockGoHome,
      goTo: vi.fn(),
      goBack: vi.fn(),
      goToDisputes: vi.fn(),
    });
  });

  it("renders phone input initially", () => {
    render(<Login />);
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText("Send OTP")).toBeInTheDocument();
  });

  it("sends OTP when form submitted", async () => {
    mockSendOtp.mockResolvedValue({});
    render(<Login />);

    fireEvent.change(screen.getByLabelText("Phone Number"), {
      target: { value: "0812345678" },
    });
    fireEvent.click(screen.getByText("Send OTP"));

    expect(mockSendOtp).toHaveBeenCalledWith("0812345678");
  });

  it("shows OTP input after sending OTP", async () => {
    mockSendOtp.mockResolvedValue({});
    render(<Login />);

    fireEvent.change(screen.getByLabelText("Phone Number"), {
      target: { value: "0812345678" },
    });
    fireEvent.click(screen.getByText("Send OTP"));

    await waitFor(() => {
      expect(screen.getByLabelText("Enter OTP")).toBeInTheDocument();
      expect(screen.getByText("Verify OTP")).toBeInTheDocument();
    });
  });

  it("verifies OTP and logs in", async () => {
    mockSendOtp.mockResolvedValue({});
    mockVerifyOtp.mockResolvedValue({
      data: {
        accessToken: "token",
        user: { phoneNumber: "0812345678", id: "user1" },
      },
    });

    render(<Login />);

    // Send OTP first
    fireEvent.change(screen.getByLabelText("Phone Number"), {
      target: { value: "0812345678" },
    });
    fireEvent.click(screen.getByText("Send OTP"));

    await waitFor(() => screen.getByLabelText("Enter OTP"));

    // Verify OTP
    fireEvent.change(screen.getByLabelText("Enter OTP"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText("Verify OTP"));

    expect(mockVerifyOtp).toHaveBeenCalledWith("0812345678", "123456");
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        "token",
        "0812345678",
        "user1",
        undefined,
      );
      expect(mockGoHome).toHaveBeenCalled();
    });
  });

  it("shows error on failed OTP send", async () => {
    mockSendOtp.mockRejectedValue(new Error("Failed"));
    render(<Login />);

    fireEvent.change(screen.getByLabelText("Phone Number"), {
      target: { value: "0812345678" },
    });
    fireEvent.click(screen.getByText("Send OTP"));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to send OTP. Please try again."),
      ).toBeInTheDocument();
    });
  });
});
