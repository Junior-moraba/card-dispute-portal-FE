import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { useNavigation } from "../navigation";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = (await vi.importActual("react-router-dom")) as any;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("useNavigation", () => {
  it("calls navigate with correct path for goTo", () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    result.current.goTo("/test");
    expect(mockNavigate).toHaveBeenCalledWith("/test");
  });

  it("calls navigate with -1 for goBack", () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    result.current.goBack();
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("calls navigate with / for goHome", () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    result.current.goHome();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("calls navigate with /disputes for goToDisputes", () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    result.current.goToDisputes();
    expect(mockNavigate).toHaveBeenCalledWith("/disputes");
  });
});
