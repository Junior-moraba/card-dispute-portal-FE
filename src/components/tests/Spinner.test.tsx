import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import Spinner from "../Spinner";

describe("Spinner", () => {
  it("renders with default size", () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass("w-8", "h-8");
  });

  it("renders with small size", () => {
    const { container } = render(<Spinner size="sm" />);
    expect(container.firstChild).toHaveClass("w-6", "h-6");
  });

  it("renders with large size", () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.firstChild).toHaveClass("w-12", "h-12");
  });

  it("has spinning animation", () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass("animate-spin");
  });
});
