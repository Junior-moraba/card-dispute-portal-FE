import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import DisputeList from "../../pages/Disputes/DisputeList";
import { DisputeStatus, DisputeReason } from "../../models/DisputeObjects";
import { disputeService } from "../../services/disputeService";
import { useAuth } from "../../context/AuthContext";

vi.mock("../../services/disputeService");
vi.mock("../../context/AuthContext");

const mockDisputeData = {
  success: true,
  data: {
    page: 1,
    returnedCount: 2,
    totalCount: 2,
    totalPages: 1,
    items: [
      {
        id: "TEST-001",
        transactionId: "T1",
        reasonCode: DisputeReason.Unauthorized,
        merchant: { name: "Test Merchant", category: "Retail" },
        reference: "REF001",
        details: "Test dispute",
        status: DisputeStatus.Pending,
        submittedAt: "2024-01-20T10:00:00Z",
        estimatedResolutionDate: "2024-01-27T10:00:00Z",
      },
    ],
  },
};

describe("DisputeList", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      userId: "test-user",
      isAuthenticated: true,
      phoneNumber: "1234567890",
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      sendOtp: vi.fn(),
      verifyOtp: vi.fn(),
      refreshToken: vi.fn(),
    });
    vi.mocked(disputeService.getDisputes).mockResolvedValue(mockDisputeData);
  });

  it("renders loading spinner initially", () => {
    render(<DisputeList />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders disputes after loading", async () => {
    render(<DisputeList />);
    await waitFor(() => {
      expect(screen.getByText("My Disputes (2)")).toBeInTheDocument();
      expect(screen.getByText("TEST-001")).toBeInTheDocument();
    });
  });

  it("renders sort buttons", async () => {
    render(<DisputeList />);
    await waitFor(() => {
      expect(screen.getByTestId("sort-date")).toBeInTheDocument();
      expect(screen.getByTestId("sort-status")).toBeInTheDocument();
    });
  });

  it("shows no disputes message when empty", async () => {
    vi.mocked(disputeService.getDisputes).mockResolvedValue({
      ...mockDisputeData,
      data: { ...mockDisputeData.data, items: [], totalCount: 0 },
    });

    render(<DisputeList />);
    await waitFor(() => {
      expect(screen.getByText("No disputes found")).toBeInTheDocument();
    });
  });
});
